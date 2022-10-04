const { expect } = require("chai");
const { 
  deployContract,
  NOT_CURRENT_OWNER
 } = require("./utils");

describe("Prize Contract maximum airdrop limit functionality", function () {

  let contract;
  let contractDeployer;
  let anonymousUserWallet;
  let newContractOwnerWallet; 

  beforeEach(async function() {
    const { 
      prize, 
      deployer,
      anonymousWallet,
      newContractOwner
    } = await deployContract();

    contract = prize;
    contractDeployer = deployer;
    anonymousUserWallet = anonymousWallet;
    newContractOwnerWallet = newContractOwner;
  });

  it("Initial max airdrop limit will be 100", async function() {

    const expectedAirdropLimit = 100;
    const initialAirdropLimit = await contract.MAX_AIRDROP_LIMIT();
    expect(Number(initialAirdropLimit)).to.equal(expectedAirdropLimit);
  });

  it("setMaxAirdropLimit functionality calling from anonymous wallet will throw error", async function() {

    const MAX_AIRDROP_LIMIT = 5;

    await expect(contract.connect(anonymousUserWallet).setMaxAirdropLimit(MAX_AIRDROP_LIMIT))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Only the contract owner will be able to call the setMaxAirdropLimit method successfully", async function() {

    const MAX_AIRDROP_LIMIT = 5;

    await contract.connect(contractDeployer).setMaxAirdropLimit(MAX_AIRDROP_LIMIT);
    const updatedMaxAirdropLimit = await contract.MAX_AIRDROP_LIMIT();
    expect(Number(updatedMaxAirdropLimit)).to.equal(MAX_AIRDROP_LIMIT);

  });

  it("Can not set airdropLimit more than the total supply.", async function() {

    const MAX_AIRDROP_LIMIT = 10005;

    await expect(contract.connect(contractDeployer).setMaxAirdropLimit(MAX_AIRDROP_LIMIT))
      .to.be.revertedWith("Can not set airdropLimit more than the total supply.");
  });

  it("Should not be able to set max airdrop limit less than 1", async function() {

    const MAX_AIRDROP_LIMIT = 0;

    await expect(contract.connect(contractDeployer).setMaxAirdropLimit(MAX_AIRDROP_LIMIT))
      .to.be.revertedWith("Can not set airdropLimit less than 1.");
  });

  it("Contract owner won't be able to airdrop more than MAX_AIRDROP_LIMIT.", async function() {

    const numberOfToken = 101;
    await expect(contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, numberOfToken))
      .to.be.revertedWith("Cannot airdrop more than airdropLimit.");
  });

  it("Contract owner will be able to airdrop upto MAX_AIRDROP_LIMIT.", async function() {

    const numberOfToken = 100;
    const initialTotalSupply = 0;
    let totalSupply = await contract.connect(anonymousUserWallet).totalSupply();
    expect(Number(totalSupply)).to.equal(initialTotalSupply);

    await contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, numberOfToken);

    const mintingCount = numberOfToken;

    totalSupply = await contract.connect(anonymousUserWallet).totalSupply();
    expect(Number(totalSupply)).to.equal(mintingCount);
  });

});