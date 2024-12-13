import React, { useState } from 'react';
import './UserDashboard.css';
import { FaLink } from "react-icons/fa6";

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import ConnectButton from './ConnectButton';
import { Link } from 'react-router-dom';

const USDTAddress = '0x76ef779fD22eBBBFE0F683363b6Ba1DFD1B12228'

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_referrer",
				"type": "address"
			}
		],
		"name": "joinNetwork",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdtTokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ReferralPaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			}
		],
		"name": "Registered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RewardWithdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "updateOwnerWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newFee",
				"type": "uint256"
			}
		],
		"name": "updateRegistrationFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newToken",
				"type": "address"
			}
		],
		"name": "updateUSDTToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawEther",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "calculateReward",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_level",
				"type": "uint256"
			}
		],
		"name": "getLevelUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "levels",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ownerShare",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "registrationFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalIncomePool",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdtTokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "referrals",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "earned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rewardBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]




const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState({});
  const [referralLink, setReferralLink] = useState('');
  const [level, setLevel] = useState(0);
  const [balance, setBalance] = useState(5);
  const [referredBy, setReferredBy] = useState('');
  const [referralList, setReferralList] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')

  async function getBalance() {
    if (!isConnected) throw Error('User disconnected')

    const ethersProvider = new BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    // The Contract object
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
    const USDTBalance = await USDTContract.owner()
    setBalance(USDTBalance)
    // console.log(formatUnits(USDTBalance, 18))
  }


  

  const copyToClipboard = () => {
    // eslint-disable-next-line
    const reflink = `https://t.me/BulldogApp_Bot?start=r${id}\n\$BDOG tokens mining is live! Two is better than one!  Join my squad, and let\'s double the fun (and earnings 🤑)! $BDOG Power Tap! 🚀`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 10000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };


  return (
    <div style={{marginBlock: ""}}>
     
     {!isConnected && <ConnectButton/>} 

     {isConnected && 
     
    
     <div className='w-full flex items-center justify-center pb-3 mt-5'>

<div className="w-[74%] font-medium bg-cards px-4 py-[15px] text-primary text-[13px] space-x-1 rounded-full flex items-center justify-between ">
        
            <span className="">
              {address}
            </span>

            
            <Link className="text-red-500 ">
  disconnect
</Link>


          </div>

    
</div>} 

   

<div className="className='w-full flex items-center justify-center pb-3'">
<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Balance</span> <span> {balance} </span>
        </div>
</div>

<div className="className='w-full flex items-center justify-center pb-3'" style={{marginBlock:"1rem"}}>
<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Level</span> <span> {level} </span>
        </div>
</div>

<div className="className='w-full flex items-center justify-center pb-3'" style={{marginBlock:"1rem", }}>
<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1" style={{backgroundColor:"green"}}>
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Start Earning</span> 
        </div>
</div>
      

<div className='w-full flex items-center justify-center pb-3'>

<button className="w-[74%] font-medium bg-cards px-4 py-[15px] text-primary text-[13px] space-x-1 rounded-full flex items-center justify-center">
            <img src="/withdraw.svg" alt="withdraw" className="w-[16px] h-[16px]"/>
            <span className="">
              Withdraw to wallet
            </span>

          </button>

    
</div>



<div className="w-full pt-3 justify-center flex-col space-y-3 px-5">
       

            {/*  */}

            <div className='w-full bg-[#17181A] rounded-[12px] relative flex flex-col space-y-4 p-4'>



<div className="flex items-center space-x-3">
  <img src='/bulllogo2.png' alt="gf" className="w-[35px]"/>
  <div className="flex flex-col">
    <h3 className="font-medium">
      Invite a friend and start earning for life
    </h3>
  </div>
</div>





            <div className="w-full flex items-center justify-between space-x-[10px]">
              <button
              
                className="w-[65%] flex space-x-2 font-medium text-[14px] barTitle bg-btn h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="">Referral Code </span>
              </button>
              <button
                onClick={copyToClipboard}
                className="w-[35%] flex space-x-2 text-primary font-medium text-[14px] barTitle bg-[#313439] h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="flex items-center">
                  <FaLink size={18} className="" />
                </span>
                <span className="">
                  {copied ? <span>Copied!</span> : <span>Copy</span>}
                </span>
              </button>
            </div>

            <div className="w-full flex items-center justify-between space-x-[10px]">
              <button
              
                className="w-[65%] flex space-x-2 font-medium text-[14px] barTitle bg-btn h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="">Referred By</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="w-[35%] flex space-x-2 text-primary font-medium text-[14px] barTitle bg-[#313439] h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="flex items-center">
                  <FaLink size={18} className="" />
                </span>
                <span className="">
                  {copied ? <span>Copied!</span> : <span>Copy</span>}
                </span>
              </button>
            </div>


            </div>



        


      
          </div>


<div>

</div>



<div className="flex items-center space-x-3">
  <img src='/bulllogo2.png' alt="gf" className="w-[35px]"/>
  <div className="flex items-center">
  <button
              
                className=" flex space-x-2 text-primary font-medium text-[14px] barTitle bg-[#313439] h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                VIEW
              </button>
    <h3 className="font-medium">
     Transaction History
    </h3>

  </div>
</div>
  </div>
  );
};

export default UserDashboard;
