# Blockchain_of_things
 Ethereum based Internet of things application for Real-Estate rental and automation 
    
* ### Installing Dependencies

1. [Ganache](https://www.trufflesuite.com/ganache) - personal blockchain for Ethereum development

2. [Node Package Manager](https://nodejs.org/en/) - To check if it's installed run
    - ``` $ node -v ```
3. [Truffle Framework](https://www.trufflesuite.com/) - To install truffle run 
      - ``` $  npm install -g truffle@5.0.5 ```
      
4. [Metamask Ethereum Wallet](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) - This a Google Chrome extension so make sure you're using chrome browser

5. [IPFS](https://dist.ipfs.io/#go-ipfs) - After downloading the right version of IPFS for your platform: 
     - ##### macOS and Linux
     ```
     $ tar xvfz go-ipfs.tar.gz
     $ cd go-ipfs
     $ ./install.sh
     ```
     Test it out:
     ```
     $ ipfs help
     ```

* ### Project setup
1. ####  Clone the Repo using 
     ``` $ git clone https://github.com/mahanthesh0r/Blockchain_of_things.git ```
     
2. #### cd into the Blockchain_of_things
    ``` $ cd Blockchain_of_things ```

3. #### Install all npm packages
    ``` $ npm install ```

4. #### Start Ganache and make sure a your connected to your local workspace

5. #### Run IPFS Daemon
    ``` $ ipfs daemon ```
6. #### Run your react client **make sure you're in your project directory** 
    ``` $ npm run start ```
    
## Demo
Make sure you have Meta-Mask extension installed.
The smart contract is deployed on Kovan testnet, therefore, you need to have funds in your wallet for the kovan testnet. 
You can request for some ethers [Here](https://gitter.im/kovan-testnet/faucet) OR [Here](https://faucet.kovan.network/)
All you have to do is paste your wallet address in there.
#### [Rent-Block](https://rent-block.herokuapp.com/)


***for the hardware please check https://github.com/mahanthesh0r/BlockchainRaspi***
   
 ***   
#### Please Give This Project A Star :star:
