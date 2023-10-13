import { expect } from "chai";
import { ethers } from "hardhat";

describe("ArtCollectibleContract", function () {
    let ArtCollectibleContract:any;
    let artCollectible:any;
    let owner:any;
    let buyer:any;

    const itemName = "Artwork";
    const itemDescription = "A beautiful piece of art";
    const itemPrice = ethers.utils.parseEther("1.0");

    beforeEach(async function () {
        [owner, buyer] = await ethers.getSigners();

        ArtCollectibleContract = await ethers.getContractFactory("ArtCollectibleContract");
        artCollectible = await ArtCollectibleContract.deploy(
            itemName,
            itemDescription,
            itemPrice
        );
        await artCollectible.deployed();
    });

    it("should allow the owner to list an item for sale", async function () {
        const newPrice = ethers.utils.parseEther("2.0"); // 2 ETH

        await expect(artCollectible.connect(owner).listForSale(newPrice))
            .to.emit(artCollectible, "ItemListed")
            .withArgs(newPrice);
        expect(await artCollectible.itemPrice()).to.equal(newPrice);
        expect(await artCollectible.isListedForSale()).to.be.true;
    });

    it("should allow the owner to unlist the item for sale", async function () {
        await artCollectible.connect(owner).listForSale(itemPrice);

        await expect(artCollectible.connect(owner).unlistForSale())
            .to.emit(artCollectible, "ItemUnlisted");
        expect(await artCollectible.isListedForSale()).to.be.false;
    });

    it("should allow a buyer to purchase the item", async function () {
        await artCollectible.connect(owner).listForSale(itemPrice);

        await expect(artCollectible.connect(buyer).purchaseItem({ value: itemPrice }))
            .to.emit(artCollectible, "ItemSold")
            .withArgs(buyer.address, itemPrice);
        expect(await artCollectible.i_am_owner()).to.equal(buyer.address);
        expect(await artCollectible.isListedForSale()).to.be.false;
    });
});
