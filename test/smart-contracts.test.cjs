const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Current NFT Platform Smart Contracts", function () {
    let geoNFTContract;
    let claimContract;
    let owner;
    let artist1;
    let artist2;
    let user1;
    let user2;
    let verificationSigner;

    // Test data
    const testMetadataURI = "ipfs://QmTestMetadata123";
    const testLatitude = 53476000; // Dublin coordinates in microdecimals
    const testLongitude = -6248900;
    const testLocation = "Dublin, Ireland";
    const testGeoHash = "gc7x3r";
    const defaultRoyalty = 500; // 5%

    beforeEach(async function () {
        [owner, artist1, artist2, user1, user2, verificationSigner] = await ethers.getSigners();
    
        // Deploy GeoTaggedNFT contract
        const GeoTaggedNFT = await ethers.getContractFactory("GeoTaggedNFT");
        geoNFTContract = await GeoTaggedNFT.deploy();
        await geoNFTContract.waitForDeployment(); // Updated for modern Hardhat
    
        // Deploy NFTClaimContract
        const NFTClaimContract = await ethers.getContractFactory("NFTClaimContract");
        claimContract = await NFTClaimContract.deploy(await geoNFTContract.getAddress()); // Updated
        await claimContract.waitForDeployment(); // Updated
    
        // Set verification signer
        await claimContract.setVerificationSigner(verificationSigner.address);
    
        // Register artist1 for minting
        await geoNFTContract.registerArtist(artist1.address);
    });

    describe("GeoTaggedNFT Contract", function () {
        describe("Artist Registration", function () {
            it("Should allow owner to register artists", async function () {
                await geoNFTContract.registerArtist(artist2.address);
                expect(await geoNFTContract.registeredArtists(artist2.address)).to.be.true;
            });

            it("Should emit ArtistRegistered event", async function () {
                await expect(geoNFTContract.registerArtist(artist2.address))
                    .to.emit(geoNFTContract, "ArtistRegistered")
                    .withArgs(artist2.address);
            });

            it("Should not allow non-owner to register artists", async function () {
                await expect(
                    geoNFTContract.connect(artist1).registerArtist(artist2.address)
                ).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });

        describe("NFT Minting", function () {
            it("Should allow registered artist to mint geo-tagged NFT", async function () {
                const tx = await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                    artist1.address,
                    testMetadataURI,
                    testLatitude,
                    testLongitude,
                    testLocation,
                    testGeoHash,
                    true, // claimable
                    defaultRoyalty
                );

                const receipt = await tx.wait();
                const tokenId = receipt.events[0].args.tokenId;

                expect(await geoNFTContract.ownerOf(tokenId)).to.equal(artist1.address);
                expect(await geoNFTContract.tokenURI(tokenId)).to.equal(testMetadataURI);
            });

            it("Should store correct geo-data when minting", async function () {
                const tx = await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                    artist1.address,
                    testMetadataURI,
                    testLatitude,
                    testLongitude,
                    testLocation,
                    testGeoHash,
                    true,
                    defaultRoyalty
                );

                const receipt = await tx.wait();
                const tokenId = receipt.events[0].args.tokenId;
                const geoData = await geoNFTContract.getGeoData(tokenId);

                expect(geoData.latitude).to.equal(testLatitude);
                expect(geoData.longitude).to.equal(testLongitude);
                expect(geoData.location).to.equal(testLocation);
                expect(geoData.artist).to.equal(artist1.address);
                expect(geoData.geoHash).to.equal(testGeoHash);
                expect(geoData.claimable).to.be.true;
            });

            it("Should emit NFTMinted event with correct parameters", async function () {
                await expect(
                    geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                        artist1.address,
                        testMetadataURI,
                        testLatitude,
                        testLongitude,
                        testLocation,
                        testGeoHash,
                        true,
                        defaultRoyalty
                    )
                ).to.emit(geoNFTContract, "NFTMinted")
                .withArgs(1, artist1.address, testLatitude, testLongitude, testMetadataURI, testGeoHash);
            });

            it("Should not allow unregistered user to mint", async function () {
                await expect(
                    geoNFTContract.connect(user1).mintGeoTaggedNFT(
                        user1.address,
                        testMetadataURI,
                        testLatitude,
                        testLongitude,
                        testLocation,
                        testGeoHash,
                        true,
                        defaultRoyalty
                    )
                ).to.be.revertedWith("GeoTaggedNFT: Caller is not a registered artist");
            });

            it("Should reject invalid coordinates", async function () {
                // Invalid latitude (too high)
                await expect(
                    geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                        artist1.address,
                        testMetadataURI,
                        91000000, // > 90 degrees
                        testLongitude,
                        testLocation,
                        testGeoHash,
                        true,
                        defaultRoyalty
                    )
                ).to.be.revertedWith("GeoTaggedNFT: Invalid latitude");

                // Invalid longitude (too low)
                await expect(
                    geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                        artist1.address,
                        testMetadataURI,
                        testLatitude,
                        -181000000, // < -180 degrees
                        testLocation,
                        testGeoHash,
                        true,
                        defaultRoyalty
                    )
                ).to.be.revertedWith("GeoTaggedNFT: Invalid longitude");
            });

            it("Should reject royalty percentage that's too high", async function () {
                await expect(
                    geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                        artist1.address,
                        testMetadataURI,
                        testLatitude,
                        testLongitude,
                        testLocation,
                        testGeoHash,
                        true,
                        1500 // 15% > 10% max
                    )
                ).to.be.revertedWith("GeoTaggedNFT: Royalty percentage too high");
            });

            it("Should increment total supply correctly", async function () {
                expect(await geoNFTContract.totalSupply()).to.equal(0);

                await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                    artist1.address,
                    testMetadataURI,
                    testLatitude,
                    testLongitude,
                    testLocation,
                    testGeoHash,
                    true,
                    defaultRoyalty
                );

                expect(await geoNFTContract.totalSupply()).to.equal(1);
            });
        });

        describe("Location Updates", function () {
            let tokenId;

            beforeEach(async function () {
                const tx = await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                    artist1.address,
                    testMetadataURI,
                    testLatitude,
                    testLongitude,
                    testLocation,
                    testGeoHash,
                    true,
                    defaultRoyalty
                );
                const receipt = await tx.wait();
                tokenId = receipt.events[0].args.tokenId;
            });

            it("Should allow artist to update location", async function () {
                const newLat = 40748817; // New York coordinates
                const newLng = -73985428;

                await geoNFTContract.connect(artist1).updateLocation(tokenId, newLat, newLng);

                const geoData = await geoNFTContract.getGeoData(tokenId);
                expect(geoData.latitude).to.equal(newLat);
                expect(geoData.longitude).to.equal(newLng);
            });

            it("Should emit LocationUpdated event", async function () {
                const newLat = 40748817;
                const newLng = -73985428;

                await expect(
                    geoNFTContract.connect(artist1).updateLocation(tokenId, newLat, newLng)
                ).to.emit(geoNFTContract, "LocationUpdated")
                .withArgs(tokenId, newLat, newLng);
            });

            it("Should not allow non-artist to update location", async function () {
                await expect(
                    geoNFTContract.connect(user1).updateLocation(tokenId, 0, 0)
                ).to.be.revertedWith("GeoTaggedNFT: Only artist can update location");
            });

            it("Should allow artist to toggle claimable status", async function () {
                let geoData = await geoNFTContract.getGeoData(tokenId);
                expect(geoData.claimable).to.be.true;

                await geoNFTContract.connect(artist1).toggleClaimable(tokenId);

                geoData = await geoNFTContract.getGeoData(tokenId);
                expect(geoData.claimable).to.be.false;
            });
        });

        describe("Royalty Implementation", function () {
            let tokenId;

            beforeEach(async function () {
                const tx = await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                    artist1.address,
                    testMetadataURI,
                    testLatitude,
                    testLongitude,
                    testLocation,
                    testGeoHash,
                    true,
                    750 // 7.5% royalty
                );
                const receipt = await tx.wait();
                tokenId = receipt.events[0].args.tokenId;
            });

            it("Should return correct royalty info", async function () {
                const salePrice = ethers.utils.parseEther("1"); // 1 ETH
                const [receiver, royaltyAmount] = await geoNFTContract.royaltyInfo(tokenId, salePrice);

                expect(receiver).to.equal(artist1.address);
                expect(royaltyAmount).to.equal(salePrice.mul(750).div(10000)); // 7.5%
            });

            it("Should use default royalty when 0 is provided", async function () {
                const tx = await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                    artist1.address,
                    testMetadataURI,
                    testLatitude,
                    testLongitude,
                    testLocation,
                    testGeoHash,
                    true,
                    0 // 0% -> should use default
                );
                const receipt = await tx.wait();
                const newTokenId = receipt.events[0].args.tokenId;

                const salePrice = ethers.utils.parseEther("1");
                const [receiver, royaltyAmount] = await geoNFTContract.royaltyInfo(newTokenId, salePrice);

                expect(receiver).to.equal(artist1.address);
                expect(royaltyAmount).to.equal(salePrice.mul(500).div(10000)); // 5% default
            });
        });
    });

    describe("NFTClaimContract", function () {
        let originalTokenId;
        let claimMetadataURI = "ipfs://QmClaimMetadata456";

        beforeEach(async function () {
            // Mint an original NFT first
            const tx = await geoNFTContract.connect(artist1).mintGeoTaggedNFT(
                artist1.address,
                testMetadataURI,
                testLatitude,
                testLongitude,
                testLocation,
                testGeoHash,
                true, // claimable
                defaultRoyalty
            );
            const receipt = await tx.wait();
            originalTokenId = receipt.events[0].args.tokenId;
        });

        describe("Claim Process", function () {
            it("Should allow valid claim with proper signature", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                const userLat = testLatitude + 50000; // Close to original location
                const userLng = testLongitude + 50000;

                // Create signature
                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, userLat, userLng, timestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                const tx = await claimContract.connect(user1).claimNFT(
                    originalTokenId,
                    claimMetadataURI,
                    userLat,
                    userLng,
                    timestamp,
                    signature
                );

                const receipt = await tx.wait();
                const claimTokenId = receipt.events[1].args.claimTokenId;

                expect(await claimContract.ownerOf(claimTokenId)).to.equal(user1.address);
                expect(await claimContract.totalClaims(originalTokenId)).to.equal(1);
                expect(await claimContract.hasUserClaimed(originalTokenId, user1.address)).to.be.true;
            });

            it("Should emit NFTClaimed event with correct parameters", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                const userLat = testLatitude + 50000;
                const userLng = testLongitude + 50000;

                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, userLat, userLng, timestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                await expect(
                    claimContract.connect(user1).claimNFT(
                        originalTokenId,
                        claimMetadataURI,
                        userLat,
                        userLng,
                        timestamp,
                        signature
                    )
                ).to.emit(claimContract, "NFTClaimed")
                .withArgs(1, originalTokenId, user1.address, 1, await ethers.provider.getBlockNumber().then(bn => bn + 1));
            });

            it("Should track claim order correctly", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                
                // First claim
                const messageHash1 = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, testLatitude + 50000, testLongitude + 50000, timestamp]
                );
                const signature1 = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash1));

                await claimContract.connect(user1).claimNFT(
                    originalTokenId,
                    claimMetadataURI,
                    testLatitude + 50000,
                    testLongitude + 50000,
                    timestamp,
                    signature1
                );

                // Second claim
                const messageHash2 = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user2.address, testLatitude + 60000, testLongitude + 60000, timestamp + 1]
                );
                const signature2 = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash2));

                await claimContract.connect(user2).claimNFT(
                    originalTokenId,
                    claimMetadataURI,
                    testLatitude + 60000,
                    testLongitude + 60000,
                    timestamp + 1,
                    signature2
                );

                const claim1Data = await claimContract.getClaimData(1);
                const claim2Data = await claimContract.getClaimData(2);

                expect(claim1Data.claimOrder).to.equal(1);
                expect(claim2Data.claimOrder).to.equal(2);
                expect(await claimContract.totalClaims(originalTokenId)).to.equal(2);
            });

            it("Should prevent double claiming by same user", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                const userLat = testLatitude + 50000;
                const userLng = testLongitude + 50000;

                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, userLat, userLng, timestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                // First claim should succeed
                await claimContract.connect(user1).claimNFT(
                    originalTokenId,
                    claimMetadataURI,
                    userLat,
                    userLng,
                    timestamp,
                    signature
                );

                // Second claim should fail
                const messageHash2 = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, userLat, userLng, timestamp + 1]
                );
                const signature2 = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash2));

                await expect(
                    claimContract.connect(user1).claimNFT(
                        originalTokenId,
                        claimMetadataURI,
                        userLat,
                        userLng,
                        timestamp + 1,
                        signature2
                    )
                ).to.be.revertedWith("NFTClaim: User has already claimed this NFT");
            });

            it("Should reject claims for non-claimable NFTs", async function () {
                // Toggle claimable status to false
                await geoNFTContract.connect(artist1).toggleClaimable(originalTokenId);

                const timestamp = Math.floor(Date.now() / 1000);
                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, testLatitude, testLongitude, timestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                await expect(
                    claimContract.connect(user1).claimNFT(
                        originalTokenId,
                        claimMetadataURI,
                        testLatitude,
                        testLongitude,
                        timestamp,
                        signature
                    )
                ).to.be.revertedWith("NFTClaim: Original NFT is not claimable");
            });

            it("Should reject old timestamps", async function () {
                const oldTimestamp = Math.floor(Date.now() / 1000) - 700; // 11+ minutes old
                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, testLatitude, testLongitude, oldTimestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                await expect(
                    claimContract.connect(user1).claimNFT(
                        originalTokenId,
                        claimMetadataURI,
                        testLatitude,
                        testLongitude,
                        oldTimestamp,
                        signature
                    )
                ).to.be.revertedWith("NFTClaim: Claim timestamp too old");
            });

            it("Should reject invalid signatures", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, testLatitude, testLongitude, timestamp]
                );
                const invalidSignature = await user1.signMessage(ethers.utils.arrayify(messageHash)); // Wrong signer

                await expect(
                    claimContract.connect(user1).claimNFT(
                        originalTokenId,
                        claimMetadataURI,
                        testLatitude,
                        testLongitude,
                        timestamp,
                        invalidSignature
                    )
                ).to.be.revertedWith("NFTClaim: Invalid signature");
            });

            it("Should reject claims from users too far from location", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                const farLat = testLatitude + 10000000; // Very far away
                const farLng = testLongitude + 10000000;

                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, farLat, farLng, timestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                await expect(
                    claimContract.connect(user1).claimNFT(
                        originalTokenId,
                        claimMetadataURI,
                        farLat,
                        farLng,
                        timestamp,
                        signature
                    )
                ).to.be.revertedWith("NFTClaim: User not close enough to artwork location");
            });
        });

        describe("Emergency Claims", function () {
            it("Should allow owner to create emergency claims", async function () {
                const tx = await claimContract.emergencyClaim(
                    originalTokenId,
                    user1.address,
                    claimMetadataURI
                );

                const receipt = await tx.wait();
                const claimTokenId = receipt.events[1].args.claimTokenId;

                expect(await claimContract.ownerOf(claimTokenId)).to.equal(user1.address);
                
                const claimData = await claimContract.getClaimData(claimTokenId);
                expect(claimData.verified).to.be.false; // Emergency claims are unverified
            });

            it("Should not allow non-owner to create emergency claims", async function () {
                await expect(
                    claimContract.connect(user1).emergencyClaim(
                        originalTokenId,
                        user1.address,
                        claimMetadataURI
                    )
                ).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });

        describe("View Functions", function () {
            it("Should return correct claim data", async function () {
                const timestamp = Math.floor(Date.now() / 1000);
                const messageHash = ethers.utils.solidityKeccak256(
                    ["uint256", "address", "int256", "int256", "uint256"],
                    [originalTokenId, user1.address, testLatitude + 50000, testLongitude + 50000, timestamp]
                );
                const signature = await verificationSigner.signMessage(ethers.utils.arrayify(messageHash));

                await claimContract.connect(user1).claimNFT(
                    originalTokenId,
                    claimMetadataURI,
                    testLatitude + 50000,
                    testLongitude + 50000,
                    timestamp,
                    signature
                );

                const claimData = await claimContract.getClaimData(1);
                expect(claimData.originalTokenId).to.equal(originalTokenId);
                expect(claimData.claimer).to.equal(user1.address);
                expect(claimData.claimOrder).to.equal(1);
                expect(claimData.claimLocation).to.equal(testLocation);
                expect(claimData.verified).to.be.true;
            });

            it("Should return correct total supply", async function () {
                expect(await claimContract.totalSupply()).to.equal(0);

                await claimContract.emergencyClaim(
                    originalTokenId,
                    user1.address,
                    claimMetadataURI
                );

                expect(await claimContract.totalSupply()).to.equal(1);
            });
        });
    });
});