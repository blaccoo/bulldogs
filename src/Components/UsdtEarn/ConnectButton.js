import { useAppKit } from '@reown/appkit/react';
import { useState } from 'react';

export default function ConnectButton() {
  const { open } = useAppKit();
  const [isCopied, setIsCopied] = useState(false); // State to track if the link is copied

  const copyToClipboard = () => {
    const url = `${window.location.origin}/usdtearn`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true); // Set copied state to true
        setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      {/* Card Above the Button */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-[80%] md:w-[60%] lg:w-[40%] text-center">
        <p className="text-sm text-gray-700">
          Unable to connect wallet? You can copy the <b>Earn</b> link and use your wallet browser for faster connection.
        </p>
        <button
          onClick={copyToClipboard}
          className={`mt-4 ${
            isCopied ? 'bg-green-500' : 'bg-[#319cdf]'
          } hover:${isCopied ? 'bg-green-400' : 'bg-[#2b8bcf]'} text-white font-medium text-sm py-2 px-4 rounded-lg transition`}
        >
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Connect Wallet Button */}
      <div className="w-full flex items-center justify-center">
        <button
          onClick={() => open()}
          className="bg-[#319cdf] flex h-full w-[70%] md:w-[50%] lg:w-[30%] rounded-full items-center justify-center py-[13px] px-4 relative space-x-1 hover:bg-[#2b8bcf] transition"
          aria-label="Connect your wallet"
        >
          <img
            src="/wallet.webp"
            alt="Connect wallet icon"
            className="w-[16px] -mt-[1px]"
            loading="lazy"
          />
          <div className="text-[13px] small-text2 font-medium text-left text-nowrap text-white flex flex-col">
            Connect your wallet
          </div>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="text-[#fff] mb-[-1px]"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
