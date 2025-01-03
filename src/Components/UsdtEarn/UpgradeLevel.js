import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { ContractAddress, ContractAbi, usdtabi, usdtaddress } from "../../contractConfig";

const UpgradeLevel = ({ isConnected, address, walletProvider }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);
  const levelToAmount = (level) => {
    switch (level) {
      case "2":
        return "30"; 
      case "3":
        return "300"; 
        case "4":
          return "3000";
          case "5":
            return "30000";
      default:
        break; // Default amount
    }
  };


  const upgradeLevel = async (level) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!level) {
      setError("Please select a level to upgrade to.");
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
  
     const amountToApprove = parseUnits(levelToAmount(level), 18);
  
      // Approve the contract to spend 3 USDT
      const approveTx = await UsdtContract.approve(ContractAddress, amountToApprove);
      await approveTx.wait(); // Wait for the transaction to be mined

      // Call the upgradeLevel function on the RisingCoinUsdtEarn contract
      const tx = await RisingCoinUsdtEarn.upgradeLevel(level);
      await tx.wait(); // Wait for the transaction to complete

      setSuccess(`Successfully upgraded to Level ${level}!`);
      setSelectedLevel(null); // Reset the selected level
      toggleModal(); // Close modal on success
    } catch (err) {
      setError(err.message || "An error occurred while upgrading the level.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Upgrade Level Button */}
      <div className="w-full flex items-center justify-center pb-3" style={{ marginBlock: "1rem" }}>
        <div
          onClick={toggleModal}
          className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
          style={{ backgroundColor: "yellow" }}
        >
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]" />
          <span className="text-secondary">Upgrade Level</span>
        </div>
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
            <h3>Upgrade Your Level</h3>
            <p>Select the level to upgrade to:</p>
            <div className="level-options">
              {[2, 3, 4, 5].map((level) => (
                <label key={level} style={{ display: "block", margin: "10px 0" }}>
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={selectedLevel === level}
                    onChange={() => setSelectedLevel(level)}
                    style={{ marginRight: "8px" }}
                  />
                  Level {level}
                </label>
              ))}
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="w-full flex items-center justify-center pb-3" style={{ marginBlock: "1rem" }}>
                <div
                  onClick={() => upgradeLevel(selectedLevel)}
                  className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
                  style={{ backgroundColor: "yellow" }}
                >
                  <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]" />
                  <span className="text-secondary">Upgrade Now</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-center pb-3" style={{ marginBlock: "1rem" }}>
                <div
                  onClick={toggleModal}
                  className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
                  style={{ backgroundColor: "red" }}
                >
                  <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]" />
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

export default UpgradeLevel;
