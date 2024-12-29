import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import ConnectButton from '../Components/UsdtEarn/ConnectButton';

// Replace this with the Hardhat local network URL
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// Replace with the impersonated address you want to check
const IMPERSONATED_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

// Replace this with the contract address of the token you want to check
const TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // CAKE token address on BSC

// Define the minimal ABI needed to interact with the token
const abi = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)"
];

const BalanceChecker = () => {
  const [balance, setBalance] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a contract instance with the token address and ABI
        const contract = new ethers.Contract(TOKEN_ADDRESS, abi, provider);

        // Fetch token symbol and decimals
        const tokenSymbol = await contract.symbol();
        const tokenDecimals = await contract.decimals();
        setSymbol(tokenSymbol);
        setDecimals(tokenDecimals);

        // Fetch the token balance of the impersonated address
        // const balanceRaw = await contract.balanceOf(IMPERSONATED_ADDRESS); getBalance("ethers.eth")
        const balanceRaw= await provider.getBalance('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
           console.log(balanceRaw)
        // Format balance to human-readable value
        const balanceFormatted = ethers.formatUnits(balanceRaw, tokenDecimals);
        setBalance(balanceFormatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <ConnectButton/>
      <h2>BSC Token Balance Checker</h2>
      <p>Token Address: <strong>{TOKEN_ADDRESS}</strong></p>
      {symbol && <p>Symbol: <strong>{symbol}</strong></p>}
      <p>Impersonated Address: <strong>{IMPERSONATED_ADDRESS}</strong></p>
      {balance !== null && decimals !== null && (
        <p>Balance: <strong>{balance} {symbol}</strong></p>
      )}
    </div>
  );
};

export default BalanceChecker;
