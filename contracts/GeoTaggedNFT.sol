// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title GeoTaggedNFT
 * @dev NFT contract for minting location-based artworks with embedded geo-coordinates
 * Supports ERC-2981 royalty standard for artist revenue sharing
 */
contract GeoTaggedNFT is ERC721, ERC721URIStorage, Ownable, IERC2981 {
    using Counters for Counters.Counter;
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    
    // Struct to store geo-location and metadata for each NFT
    struct GeoData {
        int256 latitude;     // Latitude in microdecimals (lat * 1e6)
        int256 longitude;    // Longitude in microdecimals (lng * 1e6)
        string location;     // Human-readable location description
        address artist;      // Original artist/creator address
        uint256 mintedAt;    // Timestamp when minted
        string geoHash;      // Geohash for location indexing
        bool claimable;      // Whether this NFT allows claiming
    }
    
    // Mappings
    mapping(uint256 => GeoData) public geoData;
    mapping(address => bool) public registeredArtists;
    mapping(uint256 => uint256) public royaltyPercentage; // Per token royalty (basis points)
    
    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed artist,
        int256 latitude,
        int256 longitude,
        string metadataURI,
        string geoHash
    );
    
    event ArtistRegistered(address indexed artist);
    event LocationUpdated(uint256 indexed tokenId, int256 latitude, int256 longitude);
    
    // Constants
    uint256 public constant DEFAULT_ROYALTY_PERCENTAGE = 500; // 5% in basis points
    uint256 public constant MAX_ROYALTY_PERCENTAGE = 1000;   // 10% max royalty
    
    constructor() ERC721("Current Geo-Tagged NFT", "CURRENT") {}
    
    /**
     * @dev Register an artist to allow them to mint NFTs
     * @param artist Address of the artist to register
     */
    function registerArtist(address artist) external onlyOwner {
        registeredArtists[artist] = true;
        emit ArtistRegistered(artist);
    }
    
    /**
     * @dev Mint a new geo-tagged NFT
     * @param to Address to mint the NFT to (usually the artist)
     * @param metadataURI IPFS URI containing NFT metadata
     * @param latitude Latitude coordinate in microdecimals
     * @param longitude Longitude coordinate in microdecimals
     * @param location Human-readable location description
     * @param geoHash Geohash for efficient location queries
     * @param claimable Whether this NFT allows public claiming
     * @param royaltyBasisPoints Royalty percentage in basis points (e.g., 500 = 5%)
     * @return tokenId The ID of the newly minted token
     */
    function mintGeoTaggedNFT(
        address to,
        string memory metadataURI,
        int256 latitude,
        int256 longitude,
        string memory location,
        string memory geoHash,
        bool claimable,
        uint256 royaltyBasisPoints
    ) external returns (uint256) {
        // Verify artist is registered or is owner
        require(
            registeredArtists[msg.sender] || msg.sender == owner(),
            "GeoTaggedNFT: Caller is not a registered artist"
        );
        
        // Validate coordinates (rough bounds check)
        require(
            latitude >= -90000000 && latitude <= 90000000,
            "GeoTaggedNFT: Invalid latitude"
        );
        require(
            longitude >= -180000000 && longitude <= 180000000,
            "GeoTaggedNFT: Invalid longitude"
        );
        
        // Validate royalty percentage
        require(
            royaltyBasisPoints <= MAX_ROYALTY_PERCENTAGE,
            "GeoTaggedNFT: Royalty percentage too high"
        );
        
        // Increment token ID and mint
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store geo-data
        geoData[tokenId] = GeoData({
            latitude: latitude,
            longitude: longitude,
            location: location,
            artist: msg.sender,
            mintedAt: block.timestamp,
            geoHash: geoHash,
            claimable: claimable
        });
        
        // Set royalty
        royaltyPercentage[tokenId] = royaltyBasisPoints > 0 ? 
            royaltyBasisPoints : DEFAULT_ROYALTY_PERCENTAGE;
        
        emit NFTMinted(tokenId, msg.sender, latitude, longitude, metadataURI, geoHash);
        
        return tokenId;
    }
    
    /**
     * @dev Get geo-data for a specific token
     * @param tokenId The token ID to query
     * @return GeoData struct containing all location and metadata
     */
    function getGeoData(uint256 tokenId) external view returns (GeoData memory) {
        require(_exists(tokenId), "GeoTaggedNFT: Token does not exist");
        return geoData[tokenId];
    }
    
    /**
     * @dev Update location data for an existing token (artist only)
     * @param tokenId Token ID to update
     * @param newLatitude New latitude coordinate
     * @param newLongitude New longitude coordinate
     */
    function updateLocation(
        uint256 tokenId,
        int256 newLatitude,
        int256 newLongitude
    ) external {
        require(_exists(tokenId), "GeoTaggedNFT: Token does not exist");
        require(
            geoData[tokenId].artist == msg.sender,
            "GeoTaggedNFT: Only artist can update location"
        );
        
        geoData[tokenId].latitude = newLatitude;
        geoData[tokenId].longitude = newLongitude;
        
        emit LocationUpdated(tokenId, newLatitude, newLongitude);
    }
    
    /**
     * @dev Toggle claimable status for a token (artist only)
     * @param tokenId Token ID to toggle
     */
    function toggleClaimable(uint256 tokenId) external {
        require(_exists(tokenId), "GeoTaggedNFT: Token does not exist");
        require(
            geoData[tokenId].artist == msg.sender,
            "GeoTaggedNFT: Only artist can toggle claimable status"
        );
        
        geoData[tokenId].claimable = !geoData[tokenId].claimable;
    }
    
    /**
     * @dev Get total number of minted tokens
     * @return Current token count
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // ERC2981 Royalty Implementation
    
    /**
     * @dev Returns royalty info for a token sale
     * @param tokenId Token ID being sold
     * @param salePrice Sale price to calculate royalty from
     * @return receiver Address to receive royalty payment
     * @return royaltyAmount Amount of royalty to pay
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "GeoTaggedNFT: Token does not exist");
        
        address artist = geoData[tokenId].artist;
        uint256 royalty = (salePrice * royaltyPercentage[tokenId]) / 10000;
        
        return (artist, royalty);
    }
    
    /**
     * @dev Check if contract supports an interface
     * @param interfaceId Interface identifier
     * @return true if interface is supported
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || 
               super.supportsInterface(interfaceId);
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
}