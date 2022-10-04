const { expect } = require("chai");
const { 
  deployContract
 } = require("./utils");

describe("Prize Contract burn NFT functionality", function () {

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

  it("Anonymous Wallet should be burn other's NFT", async function() {

    const numberOfToken = 5;
    await contract.connect(contractDeployer).airdrop(newContractOwnerWallet.address, numberOfToken);

    const tokenID = 1;
    await expect(contract.connect(anonymousUserWallet).burn(tokenID))
      .to.be.revertedWith("Sender is not the owner of the token.");
  });

  it("Contract Owner Wallet should be burn other's NFT", async function() {

    const numberOfToken = 5;
    await contract.connect(contractDeployer).airdrop(newContractOwnerWallet.address, numberOfToken);

    const tokenID = 1;
    await expect(contract.connect(contractDeployer).burn(tokenID))
      .to.be.revertedWith("Sender is not the owner of the token.");
  });

  it("Only NFT owner will be able to burn NFT.", async function() {

    const numberOfToken = 5;
    await contract.connect(contractDeployer).airdrop(newContractOwnerWallet.address, numberOfToken);

    const tokenID = 1;
    await contract.connect(newContractOwnerWallet).burn(tokenID);

  });
});