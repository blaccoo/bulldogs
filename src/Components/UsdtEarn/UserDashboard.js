import React, { useState } from 'react';
import './UserDashboard.css';
import ConnectButton from './WithdrawButton';
import { FaLink } from "react-icons/fa6";

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from 'ethers'

const USDTAddress = '0x617f3112bf5397D0467D315cC709EF968D9ba546'

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)'
]




const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState({});
  const [referralLink, setReferralLink] = useState('');
  const [level, setLevel] = useState(0);
  const [balance, setBalance] = useState(0);
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
    const USDTBalance = await USDTContract.balanceOf(address)

    console.log(formatUnits(USDTBalance, 18))
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
    <div style={{paddingBlock: "5rem"}}>
     
      <ConnectButton />

<div className="className='w-full flex items-center justify-center pb-3'">
<div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Balance</span> <span> {balance} </span>
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


<div class="w-full bg-cards rounded-[12px] px-4 pt-4 pb-2 flex flex-col items-center justify-center mb-3 relative"><h2 class="font-medium text-secondary text-[14px]">Mined Tokens</h2><span class="text-[26px] font-semibold">0.00</span><span class="pt-5 pb-1 font-medium text-[10px] text-[#93792b] flex items-center justify-center space-x-[2px]"><img src="/starsorange.svg" alt="dsdsf" class="w-[8px]"/><span>0 tokens profit per hour</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="11" width="11" xmlns="http://www.w3.org/2000/svg"><path d="M235.4 172.2c0-11.4 9.3-19.9 20.5-19.9 11.4 0 20.7 8.5 20.7 19.9s-9.3 20-20.7 20c-11.2 0-20.5-8.6-20.5-20zm1.4 35.7H275V352h-38.2V207.9z"></path><path d="M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path></svg></span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" class="absolute top-4 right-4 text-[#888]" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg></div>

<div className='w-full bg-[#17181A] rounded-[12px] relative flex flex-col space-y-4 p-4'>



<div className="flex items-center space-x-3">
  <img src='/bulllogo2.png' alt="gf" className="w-[35px]"/>
  <div className="flex flex-col">
    <h3 className="font-medium">
      Invite a friend
    </h3>
    <p className="text-[13px]">
      get 5% of your friend's earnings
    </p>
  </div>
</div>


{/* <div className="flex items-center space-x-1 -ml-1 pb-2">
  <img src='/prem.svg' alt="gf" className="w-[48px]"/>
  <div className="flex flex-col">
    <h3 className="font-medium">
      Invite with Telegram Premium
    </h3>
    <p className="text-[13px]">
      +100 to you and your friend
    </p>
  </div>
</div> */}


            <div className="w-full flex items-center justify-between space-x-[10px]">
              <button
              
                className="w-[65%] flex space-x-2 font-medium text-[14px] barTitle bg-btn h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="">Invite friend</span>
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
  );
};

export default UserDashboard;
