export default function Description() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#000000'}}>
        <div
          className="rounded-lg w-[90%] md:w-[70%] lg:w-[60%] max-h-[80vh] overflow-y-auto p-6"
          style={{ backgroundColor: '#1F2023' }}
        >
          <h1 className="text-2xl font-bold text-center text-secondary mb-4" >
            RSC USDT Stake Earn: Earn USDT Daily for Life
          </h1>
          <p className="text-white mb-4">
            RSC USDT Stake Earn is a revolutionary blockchain platform that allows users to earn USDT BEP20 daily by staking as little as $3 and referring at least one user.
          </p>
          <p className="text-white mb-4">
            This decentralized system ensures fairness, transparency, and a sustainable income pool managed by a smart contract.
          </p>
          <h2 className="text-xl font-semibold text-secondary mb-2" >Why Join RSC USDT Stake Earn?</h2>
          <ul className="list-disc list-inside text-white mb-4 space-y-2">
            <li>
              <b>Earn Daily USDT for Life:</b> Once you refer at least one user, you unlock lifetime daily earnings.
            </li>
            <li>
              <b>Low Entry Fee:</b> Start with just $3 USDT BEP20 and a small gas fee.
            </li>
            <li>
              <b>Withdraw Any Day:</b> It’s a completely transparent system not controlled by anyone, allowing you to withdraw your earnings any day, anytime, with no amount limit.
            </li>
            <li>
              <b>Referral Rewards:</b> Earn instant rewards for every user you refer.
            </li>
            <li>
              <b>Sustainable Income Pool:</b> Benefit from multiple revenue streams, including ads, a digital marketplace, and more.
            </li>
            <li>
              <b>Decentralized and Transparent:</b> Powered by smart contracts, ensuring secure and tamper-proof operations.
            </li>
          </ul>
          <h2  className="text-xl font-semibold text-secondary  mb-2">How to Join:</h2>
          <ol className="list-decimal list-inside text-white mb-4 space-y-2">
            <li>
              <b>Connect Your Web3 Wallet:</b> Use any web3 wallet like Trust Wallet or MetaMask.
            </li>
            <li>
              <b>Click Start Earning:</b> Begin your journey by clicking the "Start Earning" button.
            </li>
            <li>
              <b>Provide a Referral Wallet Address:</b> Paste the wallet address of the person who referred you, or use the default referral address if you don’t have one.
            </li>
            <li>
              <b>Click Join:</b> Confirm your intent to join the platform.
            </li>
            <li>
              <b>Approve Transaction:</b> Approve a $3 USDT BEP20 transaction (ensure you have a small amount of BNB for the gas fee, approximately 0.00006 BNB).
            </li>
            <li>
              <b>Confirm Transaction:</b> Return to your wallet and click "Confirmed Transaction."
            </li>
            <li>
              <b>Start Referring:</b> Copy your referral address and invite at least one user to activate your daily USDT earnings.
            </li>
          </ol>
          <p className="text-white mb-6">
            Join now and take advantage of this unique opportunity to earn USDT effortlessly while contributing to a global decentralized staking platform.
          </p>
          <div className="text-center" style={{marginBottom:"3rem"}}>
            <a
              href="/start-earning"
              className="bg-[#319cdf] hover:bg-[#2b8bcf] text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Start Earning
            </a>
          </div>
        </div>
      </div>
    );
  }
  