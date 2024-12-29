const hre = require("hardhat");

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // Replace with correct address
const USDC_ABI = ["function totalSupply() public view returns (uint)"];

async function main() {
  try {
    // Get a contract instance using the ABI and address
    const usdcToken = await hre.ethers.getContractAt(USDC_ABI, USDC_ADDRESS);

    // Debug: Check if the contract instance is valid
    if (!usdcToken) {
      console.error("Failed to get contract instance. Check the address and ABI.");
      return;
    }

    // Check current block number
    const block = await hre.ethers.provider.getBlockNumber();
    console.log("Current Block Number:", block);

    // Call the totalSupply() function
    const totalSupply = await usdcToken.totalSupply();
    
    // Convert the totalSupply to a human-readable format
    console.log("Total Supply:", hre.ethers.utils.formatUnits(totalSupply, 6));
  } catch (error) {
    // Enhanced error logging to capture details
    console.error("Error fetching data:", error.message);
    console.error("Error details:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
