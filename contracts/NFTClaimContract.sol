// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IGeoTaggedNFT {
    struct GeoData {
        int256 latitude;
        int256 longitude;
        string location;
        address artist;
        uint256 mintedAt;
        string geoHash;
        bool claimable;
    }
    
    function getGeoData(uint256 tokenId) external view returns (GeoData memory);
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title NFTClaimContract
 * @dev Allows users to claim proof-of-presence NFTs by scanning QR codes at physical locations
 * Users receive unique claim tokens that prove they visited a specific artwork location
 */
contract NFTClaimContract is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;
    
    // State variables
    Counters.Counter private _claimTokenIdCounter;
    IGeoTaggedNFT public geoTaggedNFTContract;
    
    // Struct to store claim data
    struct ClaimData {
        uint256 originalTokenId;    // ID of the original geo-tagged NFT
        address claimer;           // Address that claimed this token
        uint256 claimedAt;         // Timestamp of claim
        uint256 claimOrder;        // Order in which this was claimed (1st, 2nd, etc.)
        string claimLocation;      // Location description from original NFT
        bool verified;             // Whether claim was verified (could be used for manual verification)
    }
    
    // Mappings
    mapping(uint256 => ClaimData) public claimData;                    // Claim token ID → claim data
    mapping(uint256 => uint256) public totalClaims;                   // Original NFT ID → total claims count
    mapping(uint256 => mapping(address => bool)) public hasClaimed;   // Original NFT ID → user → has claimed
    mapping(uint256 => mapping(uint256 => uint256)) public claimTokenByOrder; // Original NFT ID → claim order → claim token ID
    mapping(bytes32 => bool) public usedSignatures;                   // Prevent signature reuse
    
    // Events
    event NFTClaimed(
        uint256 indexed claimTokenId,
        uint256 indexed originalTokenId,
        address indexed claimer,
        uint256 claimOrder,
        uint256 timestamp
    );
    
    event ClaimContractUpdated(address indexed oldContract, address indexed newContract);
    
    // Claim verification parameters
    uint256 public constant LOCATION_TOLERANCE = 100; // meters tolerance for location verification
    address public verificationSigner; // Address that signs claim verification messages
    
    constructor(address _geoTaggedNFTContract) ERC721("Current Claim Tokens", "CLAIM") {
        geoTaggedNFTContract = IGeoTaggedNFT(_geoTaggedNFTContract);
        verificationSigner = msg.sender; // Initially set to contract deployer
    }
    
    /**
     * @dev Set the verification signer address (only owner)
     * @param _verificationSigner New signer address
     */
    function setVerificationSigner(address _verificationSigner) external onlyOwner {
        verificationSigner = _verificationSigner;
    }
    
    /**
     * @dev Update the geo-tagged NFT contract address (only owner)
     * @param _newContract New contract address
     */
    function updateGeoTaggedNFTContract(address _newContract) external onlyOwner {
        address oldContract = address(geoTaggedNFTContract);
        geoTaggedNFTContract = IGeoTaggedNFT(_newContract);
        emit ClaimContractUpdated(oldContract, _newContract);
    }
    
    /**
     * @dev Claim a proof-of-presence NFT for a specific original artwork
     * @param originalTokenId The ID of the original geo-tagged NFT
     * @param claimMetadataURI IPFS URI for the claim token metadata
     * @param userLatitude User's current latitude (in microdecimals)
     * @param userLongitude User's current longitude (in microdecimals)
     * @param timestamp Timestamp of the claim attempt
     * @param signature Verification signature to prevent spoofing
     * @return claimTokenId The ID of the newly minted claim token
     */
    function claimNFT(
        uint256 originalTokenId,
        string memory claimMetadataURI,
        int256 userLatitude,
        int256 userLongitude,
        uint256 timestamp,
        bytes memory signature
    ) external nonReentrant returns (uint256) {
        // Get original NFT data
        IGeoTaggedNFT.GeoData memory originalGeoData = geoTaggedNFTContract.getGeoData(originalTokenId);
        
        // Verify the original NFT is claimable
        require(originalGeoData.claimable, "NFTClaim: Original NFT is not claimable");
        
        // Verify user hasn't already claimed this NFT
        require(!hasClaimed[originalTokenId][msg.sender], "NFTClaim: User has already claimed this NFT");
        
        // Verify timestamp is recent (within 10 minutes)
        require(
            block.timestamp <= timestamp + 600,
            "NFTClaim: Claim timestamp too old"
        );
        
        // Verify signature to prevent location spoofing
        bytes32 messageHash = keccak256(abi.encodePacked(
            originalTokenId,
            msg.sender,
            userLatitude,
            userLongitude,
            timestamp
        ));
        
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        require(!usedSignatures[ethSignedMessageHash], "NFTClaim: Signature already used");
        
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        require(recoveredSigner == verificationSigner, "NFTClaim: Invalid signature");
        
        // Mark signature as used
        usedSignatures[ethSignedMessageHash] = true;
        
        // Verify location proximity (optional - could be handled off-chain in signature)
        // This is a simplified distance check - in production you'd want more sophisticated geo verification
        bool locationValid = _verifyLocationProximity(
            originalGeoData.latitude,
            originalGeoData.longitude,
            userLatitude,
            userLongitude
        );
        require(locationValid, "NFTClaim: User not close enough to artwork location");
        
        // Increment claim counter and mint claim token
        _claimTokenIdCounter.increment();
        uint256 claimTokenId = _claimTokenIdCounter.current();
        
        // Increment total claims for this original NFT
        totalClaims[originalTokenId]++;
        uint256 claimOrder = totalClaims[originalTokenId];
        
        // Mint the claim token
        _mint(msg.sender, claimTokenId);
        _setTokenURI(claimTokenId, claimMetadataURI);
        
        // Store claim data
        claimData[claimTokenId] = ClaimData({
            originalTokenId: originalTokenId,
            claimer: msg.sender,
            claimedAt: block.timestamp,
            claimOrder: claimOrder,
            claimLocation: originalGeoData.location,
            verified: true
        });
        
        // Mark user as having claimed this NFT
        hasClaimed[originalTokenId][msg.sender] = true;
        
        // Store claim token by order for easy lookup
        claimTokenByOrder[originalTokenId][claimOrder] = claimTokenId;
        
        emit NFTClaimed(claimTokenId, originalTokenId, msg.sender, claimOrder, block.timestamp);
        
        return claimTokenId;
    }
    
    /**
     * @dev Emergency claim function for testing/admin purposes (only owner)
     * @param originalTokenId The ID of the original geo-tagged NFT
     * @param claimer Address to receive the claim token
     * @param claimMetadataURI IPFS URI for the claim token metadata
     * @return claimTokenId The ID of the newly minted claim token
     */
    function emergencyClaim(
        uint256 originalTokenId,
        address claimer,
        string memory claimMetadataURI
    ) external onlyOwner returns (uint256) {
        // Get original NFT data
        IGeoTaggedNFT.GeoData memory originalGeoData = geoTaggedNFTContract.getGeoData(originalTokenId);
        
        // Verify user hasn't already claimed this NFT
        require(!hasClaimed[originalTokenId][claimer], "NFTClaim: User has already claimed this NFT");
        
        // Increment claim counter and mint claim token
        _claimTokenIdCounter.increment();
        uint256 claimTokenId = _claimTokenIdCounter.current();
        
        // Increment total claims for this original NFT
        totalClaims[originalTokenId]++;
        uint256 claimOrder = totalClaims[originalTokenId];
        
        // Mint the claim token
        _mint(claimer, claimTokenId);
        _setTokenURI(claimTokenId, claimMetadataURI);
        
        // Store claim data
        claimData[claimTokenId] = ClaimData({
            originalTokenId: originalTokenId,
            claimer: claimer,
            claimedAt: block.timestamp,
            claimOrder: claimOrder,
            claimLocation: originalGeoData.location,
            verified: false // Mark as unverified since it's emergency claim
        });
        
        // Mark user as having claimed this NFT
        hasClaimed[originalTokenId][claimer] = true;
        
        // Store claim token by order for easy lookup
        claimTokenByOrder[originalTokenId][claimOrder] = claimTokenId;
        
        emit NFTClaimed(claimTokenId, originalTokenId, claimer, claimOrder, block.timestamp);
        
        return claimTokenId;
    }
    
    /**
     * @dev Get claim data for a specific claim token
     * @param claimTokenId The claim token ID to query
     * @return ClaimData struct containing all claim information
     */
    function getClaimData(uint256 claimTokenId) external view returns (ClaimData memory) {
        require(_exists(claimTokenId), "NFTClaim: Claim token does not exist");
        return claimData[claimTokenId];
    }
    
    /**
     * @dev Get total number of claims for an original NFT
     * @param originalTokenId The original NFT ID
     * @return Total number of claims
     */
    function getTotalClaims(uint256 originalTokenId) external view returns (uint256) {
        return totalClaims[originalTokenId];
    }
    
    /**
     * @dev Get claim token ID by order for an original NFT
     * @param originalTokenId The original NFT ID
     * @param order The claim order (1st, 2nd, etc.)
     * @return The claim token ID
     */
    function getClaimTokenByOrder(uint256 originalTokenId, uint256 order) 
        external 
        view 
        returns (uint256) 
    {
        return claimTokenByOrder[originalTokenId][order];
    }
    
    /**
     * @dev Check if a user has claimed a specific original NFT
     * @param originalTokenId The original NFT ID
     * @param user The user address
     * @return true if user has claimed, false otherwise
     */
    function hasUserClaimed(uint256 originalTokenId, address user) external view returns (bool) {
        return hasClaimed[originalTokenId][user];
    }
    
    /**
     * @dev Get total supply of claim tokens
     * @return Current claim token count
     */
    function totalSupply() external view returns (uint256) {
        return _claimTokenIdCounter.current();
    }
    
    /**
     * @dev Verify if user location is close enough to artwork location
     * @param artworkLat Artwork latitude in microdecimals
     * @param artworkLng Artwork longitude in microdecimals  
     * @param userLat User latitude in microdecimals
     * @param userLng User longitude in microdecimals
     * @return true if user is within acceptable distance
     */
    function _verifyLocationProximity(
        int256 artworkLat,
        int256 artworkLng,
        int256 userLat,
        int256 userLng
    ) internal pure returns (bool) {
        // Simplified distance check - in production use proper haversine formula
        // This uses a rough approximation for small distances
        int256 latDiff = artworkLat > userLat ? artworkLat - userLat : userLat - artworkLat;
        int256 lngDiff = artworkLng > userLng ? artworkLng - userLng : userLng - artworkLng;
        
        // Rough conversion: 1 degree ≈ 111km, so 1 microdegree ≈ 0.111m
        // For 100m tolerance, we allow ~900,000 microdecimals difference
        uint256 tolerance = 900000;
        
        return uint256(latDiff) <= tolerance && uint256(lngDiff) <= tolerance;
    }
    
    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
    * @dev Check if contract supports an interface
    * @param interfaceId Interface identifier
    * @return true if interface is supported
    */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}