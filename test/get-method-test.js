const { expect } = require("chai");
const { 
  deployContract,
 } = require("./utils");

describe("Prize Contract Get Method Test", function () {

  let contract;
  let contractDeployer;
  let anonymousUserWallet;

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

  it("maxSupply will be 10000", async function() {

    const expectedMaxSupply = 10000;
    const maxSupply = await contract.connect(anonymousUserWallet).maxSupply();
    expect(Number(maxSupply)).to.equal(expectedMaxSupply);
  });

  it("totalSupply should be updated after doing airdrop NFT", async function() {

    const initialTotalSupply = 0;
    let totalSupply = await contract.connect(anonymousUserWallet).totalSupply();
    expect(Number(totalSupply)).to.equal(initialTotalSupply);

    await contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, 1);

    const mintingCount = 1;

    totalSupply = await contract.connect(anonymousUserWallet).totalSupply();
    expect(Number(totalSupply)).to.equal(mintingCount);
  });

 

  it("tokenURI provide error for invalid tokenID.", async function() {

    await contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, 1);
    try {
      const tokenURI = await contract.connect(anonymousUserWallet).tokenURI(0);
    } catch(error) {
      errorReason = error.reason;

    } finally {
      expect(errorReason).to.equal('ERC721: invalid token ID');
    }
  });

  it("claimedBy provide per wallet minting information", async function() {

    const initialClaime = 0;
    let claime = await contract.connect(anonymousUserWallet).balanceOf(anonymousUserWallet.address);
    expect(Number(claime)).to.equal(initialClaime);

    const airdropCount = 1;
    await contract.connect(contractDeployer).airdrop(anonymousUserWallet.address, airdropCount);

    claime = await contract.connect(anonymousUserWallet).balanceOf(anonymousUserWallet.address);
    expect(Number(claime)).to.equal(airdropCount);
  });

  
});
