import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { ContractAddress, ContractAbi, usdtabi, usdtaddress } from "../../contractConfig";

const StartEarning = ({ isConnected, address, walletProvider }) => {
  const [referrer, setReferrer] = useState("0xB43B5cDf89d42795C1d1a84e83fE46f488b14143");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setReferrer(text);
    } catch (err) {
      setError("Failed to read clipboard content.");
    }
  };

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

      const RisingCoinUsdtEarn = new Contract(ContractAddress, ContractAbi, signer);
      const UsdtContract = new Contract(usdtaddress, usdtabi, signer);

      const amountToApprove = parseUnits("3", 18);

      const approveTx = await UsdtContract.approve(ContractAddress, amountToApprove);
      await approveTx.wait();

      const tx = await RisingCoinUsdtEarn.joinNetwork(referrerAddress);
      await tx.wait();

      setSuccess("Successfully joined the network! Start earning now.");
      setReferrer("");
      toggleModal();
    } catch (err) {
      setError(err.reason || "An error occurred while joining the network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full flex items-center justify-center pb-3" style={{ marginBlock: "1rem" }}>
        <div
          onClick={toggleModal}
          className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
          style={{ backgroundColor: "green" }}
        >
          <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]" />
          <span className="text-secondary">Start Earning</span>
        </div>
      </div>

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
            <form onSubmit={() => joinNetwork(referrer)}>
              <label htmlFor="referrer">Referral Address:</label>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="text"
                  id="referrer"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                  placeholder="Enter referral address"
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    color: "#000",
                  }}
                />
                <button
                  type="button"
                  onClick={pasteFromClipboard}
                  style={{
                    marginLeft: "10px",
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Paste
                </button>
              </div>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                onClick={() => joinNetwork(referrer)}
                className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1"
                style={{ backgroundColor: "green" }}
              >
                <img src="/bulllogo2.png" alt="sfdf" className="w-[14px]" />
                <span className="text-secondary">Join Now</span>
              </div>
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
      )}
    </div>
  );
};

export default StartEarning;
