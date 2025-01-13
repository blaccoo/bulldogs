import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { ContractAddress, ContractAbi,usdtabi,usdtaddress } from "../../contractConfig";


const StartEarning = ({ isConnected, address, walletProvider }) => {
  const [referrer, setReferrer] = useState("0xB43B5cDf89d42795C1d1a84e83fE46f488b14143");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const joinNetwork = async (referrerAddress) => { 
    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }
  
    if (!referrerAddress) {
      setError("Please enter a valid referral address.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
 
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
  
      // Instantiate contracts
      const RisingCoinUsdtEarn = new Contract(ContractAddress, ContractAbi, signer);
      const UsdtContract = new Contract(usdtaddress, usdtabi, signer);
  
      // Convert 3 USDT to the smallest unit (assuming USDT uses 6 decimals)
      const amountToApprove = parseUnits("3", 18); // 3 USDT in smallest unit
  
      // Approve the contract to spend 3 USDT
      const approveTx = await UsdtContract.approve(ContractAddress, amountToApprove);
      await approveTx.wait(); // Wait for the transaction to be mined
  
      // Call the joinNetwork function on the RisingCoinUsdtEarn contract
      const tx = await RisingCoinUsdtEarn.joinNetwork(referrerAddress);
      await tx.wait(); // Wait for the transaction to complete
  
      setSuccess("Successfully joined the network! Start earning now.");
      setReferrer(""); // Reset the input field
      toggleModal(); // Close modal on success
    } catch (err) {
      setError(err.reason || "An error occurred while joining the network.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
 

      {/* Start Earning Button */}
  

      <div className="className='w-full flex items-center justify-center pb-3'" style={{marginBlock:"1rem", }}>
<div   onClick={toggleModal} className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1" style={{backgroundColor:"green"}}>
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Start Earning</span> 
        </div>
</div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex:"1000",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#0F1011",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
    
    
     <form onSubmit={() => joinNetwork(referrer)}>
     <label htmlFor="referrer">Referral Address:</label>
            <input
  type="text"
  id="referrer"
 // Assuming referrer is a state variable
  onChange={(e) => setReferrer(e.target.value)} // Updates state on input change
  placeholder="Paste your referal address here or continue with default address"
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    color: "#000",
    cursor: "pointer"
  }}
/>

     </form>

   
                
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}


            <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="className='w-full flex items-center justify-center pb-3'" style={{marginBlock:"1rem", }}>
<div                   onClick={() => joinNetwork(referrer)} className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1" style={{backgroundColor:"green"}}>
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Join Now</span> 
        </div>
</div>
<div className="className='w-full flex items-center justify-center pb-3'" style={{marginBlock:"1rem", }}>
<div                   onClick={toggleModal} className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1" style={{backgroundColor:"red"}}>
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Cancel</span> 
        </div>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartEarning;