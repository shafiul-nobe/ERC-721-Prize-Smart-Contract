const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("./utils");

describe("Prize Contract Initialization", function () {
  it("Should Deploy Prize Smart Contract", async function () {
    const Prize = await ethers.getContractFactory("Prize");
    const prize = await Prize.deploy();
    await prize.deployed();
  });

  it("Should be Deployed without any parameter in the constructor", async function () {
    const Prize = await ethers.getContractFactory("Prize");
    const prize = await Prize.deploy();
    await prize.deployed();
  });

  it("Should not be deployed with the constructor parameter during deployment", async function () {
    const Prize = await ethers.getContractFactory("Prize");
    

    let errorReason = '';
    try {
      const invalidParameter = "INVALID_PARAMETER";
      const prize = await Prize.deploy(invalidParameter);
      await prize.deployed();
    } catch (error) {
      errorReason = error.reason;
    } finally {
      expect(errorReason).to.equal('too many arguments:  in Contract constructor');
    }
  });

  it("The contract name should be 'prize'", async function () {
    const { prize } = await deployContract();
    const expectedContractName = "prize";
    const contractName = await prize.name();
    expect(contractName).to.equal(expectedContractName);
  });

  it("The contract symbol should be 'PRIZE'", async function () {
    const { prize } = await deployContract();
    const expectedContractSymbol = "PRIZE";
    const contractSymbol = await prize.symbol();
    expect(contractSymbol).to.equal(expectedContractSymbol);
  });

  it("Should have Maximum NFT minting limit = 10000", async function () {
    const { prize } = await deployContract();
    const expectedMaximumNFT = 10000;
    const maxNFTlimit = await prize.maxSupply();
    expect(Number(maxNFTlimit)).to.equal(expectedMaximumNFT);
  });

  it("Contract owner and deployer wallet address same", async function () {
    const { prize, deployer } = await deployContract();
    const contractOwner = await prize.owner();
    expect(contractOwner).to.equal(deployer.address);
  });
});
