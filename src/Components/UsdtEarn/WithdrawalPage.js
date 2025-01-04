import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { ContractAddress, ContractAbi,usdtabi,usdtaddress } from "../../contractConfig";

const WithdrawalPage = ({ isConnected, address, walletProvider }) => {
  const [amount, setAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const withdrawFunds = async (withdrawAmount) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const RisingCoinUsdtEarn = new Contract(ContractAddress, ContractAbi, signer);

  
      // Convert 3 USDT to the smallest unit (assuming USDT uses 6 decimals)
      const amountToApprove = parseUnits(withdrawAmount, 18); // 3 USDT in smallest unit
  
   
  
      const tx = await RisingCoinUsdtEarn.withdrawRewards(amountToApprove );
      await tx.wait();

      setSuccess("Withdrawal successful! Your funds are on the way.");
      setAmount(""); // Reset the input field
      toggleModal(); // Close modal on success
    } catch (err) {
      console.log(err.reason)
      setError(err.reason || "An error occurred while processing your withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Withdraw Funds Button */}
      <div className='w-full flex items-center justify-center pb-3'>
      <button    onClick={toggleModal} className="w-[74%] font-medium bg-cards px-4 py-[15px] text-primary text-[13px] space-x-1 rounded-full flex items-center justify-center">
            <img src="/withdraw.svg" alt="withdraw" className="w-[16px] h-[16px]"/>
            <span className="">
              Withdraw to wallet
            </span>

          </button>
          </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: "1000",
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
            <label htmlFor="amount">Withdrawal Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                color:"#000"
              }}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                onClick={() => withdrawFunds(amount)}
                className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
                style={{ backgroundColor: "green", cursor: "pointer" }}
              >
                <img src="/bulllogo2.png" alt="withdraw" className="w-[14px]" />
                <span className="text-secondary">{loading ? "Processing..." : "Confirm"}</span>
              </div>
              <div
                onClick={toggleModal}
                className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
                style={{ backgroundColor: "red", cursor: "pointer" }}
              >
                <img src="/bulllogo2.png" alt="cancel" className="w-[14px]" />
                <span className="text-secondary">Cancel</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalPage;
