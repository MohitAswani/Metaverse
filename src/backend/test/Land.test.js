const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

const EVM_REVERT = 'VM Exception while processing transaction: revert'

describe("Land", function () {
  let deployer, addr1, addr2, land;
  let NAME = "METAVERSE buildings";
  let SYMBOL = "META";
  let COST = toWei(1);

  // Also we need to wrap this code in a beforeEach hook so that this code runs before every tests.

  beforeEach(async function () {
    const Land = await ethers.getContractFactory("Land");

    [deployer, addr1, addr2] = await ethers.getSigners();

    land = await Land.deploy(NAME, SYMBOL, COST);
  });

  describe("Deployment", () => {
    it("returns the contract name", async () => {
      expect(await land.name()).to.equal(NAME);
    });
    it("returns the contract symbol", async () => {
      expect(await land.symbol()).to.equal(SYMBOL);
    });
    it("returns the contract cost to mint", async () => {
      expect(await land.cost()).to.equal(COST);
    });
    it("returns the max supply", async () => {
      expect(await land.maxSupply()).to.equal("5");
    });
    it("returns the number of buildings/land avialable", async () => {
      expect((await land.getBuildings()).length).to.equal(5);
    });
  });

  describe("Minting", () => {
    describe("Success", () => {
      beforeEach(async () => {
        console.log(addr1);
        await land.connect(addr1).mint(1, { value: COST });
      });

      it("Updates the owner address", async () => {
        expect(await land.ownerOf(1)).to.equal(addr1.address);
      });

      it("Updates building details", async () => {
        expect((await land.getBuilding(1)).owner).to.equal(addr1.address);
      });
    });

    describe("Failure", () => {
      it("prevents mint with 0 value", async () => {
        await expect(
          land.connect(addr1).mint(1, { value: 0 })
        ).to.be.revertedWith("Too less ether provided");
      });

      it("prevents mint with invalid id", async () => {
        await expect(land.connect(addr1).mint(10, { value: COST })).to.be
          .reverted;
      });

      it("prevents mint if already owned", async () => {
        await land.connect(addr1).mint(1, { value: COST });
        await expect(
          land.connect(addr2).mint(1, { value: COST })
        ).to.be.revertedWith("Building already has a owner");
      });
    });
  });

  describe("Transfers", () => {
    describe("success", () => {
      beforeEach(async () => {
        await land.connect(addr1).mint(1, { value: COST });
        await land.connect(addr1).approve(addr2.address, 1);
        await land.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
      });

      it("Updates the owner address", async () => {
        expect(await land.ownerOf(1)).to.equal(addr2.address);
      });

      it("Updates the building details", async () => {
        expect((await land.getBuilding(1)).owner).to.equal(addr2.address);
      });
    });

    describe("failure", () => {
        it("Prevents transfers without ownership", async () => {
            await expect(land.connect(addr2).transferFrom(addr1.address, addr2.address, 1)).to.be.reverted;
        });

        it("Prevents transfers without approval", async () => {
            await land.connect(addr1).mint(1, { value: COST });
            await expect(land.connect(addr2).transferFrom(addr1.address, addr2.address, 1)).to.be.reverted;
        });
      });
  });
});
