const { expect } = require("chai");
const { 
  deployContract,
  NOT_CURRENT_OWNER
 } = require("./utils");

describe("Prize Contract Owner Functionality", function () {

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


  it("Deployer should be initial contract owner", async function() {
    const contractOwner = await contract.owner();
    expect(contractOwner).to.equal(contractDeployer.address);
  });

  it("transferOwnership call from anonymous wallet should through error", async function() {

    await expect(contract.connect(anonymousUserWallet).transferOwnership(newContractOwnerWallet.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
    
  });

  it("Only the contract owner can call the transferOwnership method", async function() {

    await contract.connect(contractDeployer).transferOwnership(newContractOwnerWallet.address);
    
  });

  it("After successfully calling transferOwnership method new wallet will be contract owner", async function() {

    await contract.connect(contractDeployer).transferOwnership(newContractOwnerWallet.address);
    const contractOwner = await contract.owner();
    expect(contractOwner).to.equal(newContractOwnerWallet.address);
    
  });

  it("After changing contract owner previous owner will get error while calling transferOwnership method", async function() {

    await contract.connect(contractDeployer).transferOwnership(newContractOwnerWallet.address);
    const contractOwner = await contract.owner();
    expect(contractOwner).to.equal(newContractOwnerWallet.address);
    await expect(contract.connect(contractDeployer).transferOwnership(newContractOwnerWallet.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
    
  });
});
