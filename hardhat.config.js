require("@nomiclabs/hardhat-ethers");



module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      forking: { 
        // url: "https://bnb-mainnet.g.alchemy.com/v2/-QHs-DWnXqd4KhBxEeNQsgske3P5crFd", // Alternative provider
        url: "https://eth-mainnet.g.alchemy.com/v2/-QHs-DWnXqd4KhBxEeNQsgske3P5crFd",
    
      },
    },
  },
};

