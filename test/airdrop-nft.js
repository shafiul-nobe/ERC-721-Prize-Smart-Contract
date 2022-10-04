const { expect } = require("chai");
const { 
  deployContract,
  NOT_CURRENT_OWNER
 } = require("./utils");

describe("Prize Contract airdrop Functionality", function () {

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

  it("airdrop functionality calling from anonymous wallet will throw error", async function() {

    const numberOfToken = 5;

    await expect(contract.connect(anonymousUserWallet).airdrop(newContractOwnerWallet.address, numberOfToken))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Only the contract owner will be able to call the airdrop method successfully", async function() {

    const numberOfToken = 5;

    await contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, numberOfToken);
    for(let i = 1; i <= numberOfToken; i++) {
      const tokenOwner = await contract.ownerOf(i);
      expect(tokenOwner).to.equals(anonymousUserWallet.address);
    }

  });

  it("User will get specific number of token airdropped by contract owner ", async function() {

    const numberOfToken = 5;

    await contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, numberOfToken);
    const airdroppedTokenCount = await contract.connect(anonymousUserWallet).balanceOf(anonymousUserWallet.address);
    expect(airdroppedTokenCount).to.equal(numberOfToken);

  });
});