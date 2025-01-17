import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import { FaLink } from "react-icons/fa6";
import { useDisconnect } from '@reown/appkit/react'
import { ethers } from "ethers";
import { ContractAddress, ContractAbi,usdtabi,usdtaddress } from "../../contractConfig";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import ConnectButton from './ConnectButton';
import { Link } from 'react-router-dom';
import StartEarning from './StartEarning';
import WithdrawalPage from './WithdrawalPage';
import UpgradeLevel from './UpgradeLevel';







const UserDashboard = () => {
  const [nextDistribution, setNextDistribution] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [referralLink, setReferralLink] = useState('');
  const [level, setLevel] = useState("0");
  const [earned, setEarned] = useState("0");
  const [join, setJoin] = useState(false);
  const [balance, setBalance] = useState(5);
  const [referredBy, setReferredBy] = useState('');
  const [referrer, setReferrer] = useState("");
  const [referralList, setReferralList] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [copied3, setCopied3] = useState(false);
  const [error, setError] = useState(null);
  const [activatedEarnings, setActivatedEarnings] = useState("false");
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const { disconnect } = useDisconnect()

  const [copiedReferral, setCopiedReferral] = useState(null);




  const copyReferralToClipboard = (referral) => {
    navigator.clipboard
      .writeText(referral)
      .then(() => {
        setCopiedReferral(referral);
        setCopied3(true);
        setTimeout(() => {
          setCopied3(false);
          setCopiedReferral(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy referral: ", err);
      });
  };
  




  useEffect(() => {
    if (isConnected) {
      fetchUserDetails(address);
	    getReferrals(address); 
      fetchLastRewardDistribution();
    }
  }, [isConnected]);

  const fetchLastRewardDistribution = async () => {
    if (!isConnected || !address) return;

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(ContractAddress, ContractAbi, ethersProvider);

      // Fetch last reward distribution timestamp from the contract
      const lastRewardTimestamp = await contract.lastRewardDistribution();
            console.log(lastRewardTimestamp)
      // Assuming the reward is distributed every 24 hours (86400 seconds)
      const nextTimestamp = Number(lastRewardTimestamp) + 86400;
      setNextDistribution(nextTimestamp);

      // Start the countdown
      startCountdown(nextTimestamp);
    } catch (error) {
      console.error("Error fetching last reward distribution: ", error.reason);
    }
  };

  const startCountdown = (targetTimestamp) => {
    const updateCountdown = () => {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeRemaining = targetTimestamp - currentTime;

      if (timeRemaining <= 0) {
        setCountdown("Distribution is happening now!");
        clearInterval(countdownTimer);
        return;
      }

      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      const seconds = timeRemaining % 60;

      setCountdown(
        `${hours.toString().padStart(2, '0')}h : ${minutes
          .toString()
          .padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`
      );
    };

    // Start the interval to update the countdown every second
    const countdownTimer = setInterval(updateCountdown, 1000);

    // Update immediately so there's no delay before the first update
    updateCountdown();

    // Clear the interval when the component unmounts
    return () => clearInterval(countdownTimer);
  };

    


  const getReferrals = async (walletAddress) => {
    if (!walletAddress) return;
  
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const RisingCoinUsdtEarn = new Contract(ContractAddress, ContractAbi, ethersProvider);
      
      // Assuming `getReferrals` is a function in the contract that returns an array of referred users
      const referrals = await RisingCoinUsdtEarn.getReferrals(walletAddress); // Modify this as per the actual contract function
  console.log(referrals[0])
      setReferralList(referrals);  // Set the referrals in the state
    } catch (err) {
      setError("Error fetching referrals: " + err.reason);
    }
  };
 
  const fetchUserDetails = async (walletAddress) => {
    if (!walletAddress) return;

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
    //   const signer = await ethersProvider.getSigner();
      const RisingCoinUsdtEarn = new Contract(ContractAddress, ContractAbi, ethersProvider);
	  const UsdtContract = new Contract(usdtaddress, usdtabi, ethersProvider);
      // Fetch user data from the contract
	

      const userInfo = await RisingCoinUsdtEarn.users(walletAddress); // Assuming `users` returns user details
    
      setActivatedEarnings(userInfo.activatedEarnings.toString());
      console.log(userInfo.level.toString())
     const amountearned= formatUnits(userInfo.earned, "ether")
      setLevel(userInfo.level.toString());
   
      setEarned(amountearned);
      setReferredBy(userInfo.referrer.toString());
    } catch (err) {
      setError("Error fetching user details: " + err.reason);
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
    <div style={{marginBottom: "6rem"}}>

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
{isConnected && (
  <div className="flex items-center justify-center pb-3">
    <p
      className={`font-bold text-lg ${
        activatedEarnings === "true" ? "text-green-500" : "text-red-500"
      }`}
    >
      {activatedEarnings === "true" ? "Active Wallet" : "Wallet Not Active"}
    </p>
  </div>
)}

   
{isConnected && 


<div className="className='w-full flex items-center justify-center pb-3'">


<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Earned</span> <span> {earned} USDT</span>
        </div>
</div> }
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
{ isConnected && 
 <div className="flex flex-col items-center justify-center">
 <h3 className="text-xl font-bold">Next Reward Distribution</h3>
 {countdown ? (
   <p className="countdown text-lg">{countdown}</p>
 ) : (
   <p>Fetching the next distribution time...</p>
 )}
</div>

}
    
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
                  {copied2 ? <span>Copied!</span> : <span>Copy</span>}
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


{isConnected && referralList.length > 0 && (
  <div className="w-full pt-3 px-5">
    <div className="w-full bg-[#17181A] rounded-[12px] p-4">
      <h3 className="font-medium text-lg mb-3 text-white">Referral List</h3>
      <ul className="space-y-2">
        {referralList.map((referral, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-[#313439] px-4 py-2 rounded-md"
          >
            <span className="text-primary">{truncateAddress(referral)}</span>
            <button
              onClick={() => copyReferralToClipboard(referral)}
              className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
            >
              {copied3 && referral === copiedReferral ? "Copied!" : "Copy"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}


  </div>
  );
};

export default UserDashboard;
