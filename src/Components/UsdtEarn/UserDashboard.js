import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import { FaLink } from "react-icons/fa6";
import { useDisconnect } from '@reown/appkit/react'
import { ContractAddress, ContractAbi,usdtabi,usdtaddress } from "../../contractConfig";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import ConnectButton from './ConnectButton';
import { Link } from 'react-router-dom';
import StartEarning from './StartEarning';
import WithdrawalPage from './WithdrawalPage';
import UpgradeLevel from './UpgradeLevel';







const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState({});
  const [referralLink, setReferralLink] = useState('');
  const [level, setLevel] = useState(null);
  const [earned, setEarned] = useState(null);
  const [join, setJoin] = useState(false);
  const [balance, setBalance] = useState(5);
  const [referredBy, setReferredBy] = useState('');
  const [referrer, setReferrer] = useState("");
  const [referralList, setReferralList] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [error, setError] = useState(null);
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const { disconnect } = useDisconnect()









  useEffect(() => {
    if (isConnected) {
      fetchUserDetails(address);
	  
    }
  }, [isConnected]);
 
  const fetchUserDetails = async (walletAddress) => {
    if (!walletAddress) return;

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
    //   const signer = await ethersProvider.getSigner();
      const RisingCoinUsdtEarn = new Contract(ContractAddress, ContractAbi, ethersProvider);
	  const UsdtContract = new Contract(usdtaddress, usdtabi, ethersProvider);
      // Fetch user data from the contract
	

      const userInfo = await RisingCoinUsdtEarn.users(walletAddress); // Assuming `users` returns user details

      console.log(userInfo.level.toString())
     const amountearned= formatUnits(userInfo.earned, "ether")
      setLevel(userInfo.level.toString());
   
      setEarned(amountearned);
      setReferredBy(userInfo.referrer.toString());
    } catch (err) {
      setError("Error fetching user details: " + err.message);
    }
  };


  const truncateAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };  


  

  const copyToClipboard = () => {
    // eslint-disable-next-line
    const reflink = address

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

  const copyToClipboard2 = () => {
    // eslint-disable-next-line
    const reflink = referredBy

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied2(true);
          setTimeout(() => setCopied2(false), 10000); // Reset the copied state after 2 seconds
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
        setTimeout(() => setCopied2(false), 2000); // Reset the copied state after 2 seconds
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
     
    
     <div className='w-full flex items-center justify-center pb-3 mt-3'>

<div className="w-[74%] font-medium bg-cards px-4 py-[15px] text-primary text-[13px] space-x-1 rounded-full flex items-center justify-between ">
        
            <span className="" >
              {truncateAddress(address)}
            </span>

            
            <Link 
  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 shadow-lg" 
  style={{ textDecoration: "none", textAlign: "center", borderRadius: "30px" }} 
  onClick={() => disconnect()}
>
  Disconnect
</Link>




          </div>

    
</div>} 

   
{isConnected && 
<div className="className='w-full flex items-center justify-center pb-3'">
<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Earned</span> <span> {earned} USDT</span>
        </div>
</div>}
{isConnected && 
<div className="className='w-full flex items-center justify-center pb-3'" style={{marginBlock:"1rem"}}>
<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Level</span> <span>  {" " + level} </span>
        </div>
</div>}




{isConnected && 
<StartEarning isConnected address walletProvider={walletProvider}/>}
{isConnected && 
<UpgradeLevel isConnected address walletProvider={walletProvider} />}
      
{isConnected && 

<WithdrawalPage isConnected={isConnected} address={address} walletProvider={walletProvider} />}

{isConnected && 
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
                onClick={copyToClipboard2}
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



        


      
          </div>}



         { isConnected && 

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
</div>}


  </div>
  );
};

export default UserDashboard;
