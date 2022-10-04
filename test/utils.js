const { ethers } = require("hardhat");;

const NOT_CURRENT_OWNER = "018001";

async function deployContract() {

    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    const anonymousWallet = accounts[9];
    const newContractOwner = accounts[5];

    const Prize = await ethers.getContractFactory("Prize");
    const prize = await Prize.deploy();
    await prize.deployed();

    return {
        prize,
        deployer,
        anonymousWallet,
        newContractOwner
    };
}

module.exports = {
    deployContract,
    NOT_CURRENT_OWNER
}