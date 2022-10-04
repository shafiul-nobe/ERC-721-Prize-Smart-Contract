
This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

##### Requirements

- node v16.9.0
- yarn >= v1.22.4

##### Step
- First install necessary packages
	````
		yarn install
	````
- To compile solidity run the following command
	````
		yarn compile
	````
-  To test the unit test cases run
	````
		yarn test
	````


- For deployment please add the environment variables in the .env file or it can be provided by the command line.  For .env file we need to add the following property. (Note: .env file is included in git ignore. So any property in that file won't be pushed). There is file named example.env that will help to create .env file.
    ```
    PRIVATE_KEY=<the private key which will be used for deploying the smart contract. This account will be providing the deployment gas fee cost>
    NETWORK=<the network name to which this smart contract will be deployed (mainnet, rinkeby)>
    ```
- Deploy smart contract in rinkeby we need to run the following command
	````
		yarn deploy:contract:rinkeby
	````
- Deploy smart contract in main net we need to run the following command
	````
		yarn deploy:contract:mainnet
	````
- To verify the contract address we need to run the following command
    ````
        npx hardhat verify --network <network> <newly deployed contract address>
    ````
    example 
    ````
        npx hardhat verify --network rinkeby 0xC2817D0f4deeCe26dF0635a4128DB3bB3729f872
    ````
