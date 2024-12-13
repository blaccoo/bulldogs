
import { useAppKit } from '@reown/appkit/react'



export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit()

  return (

    
    <div className='w-full flex items-center justify-center pb-3'>
    <button onClick={() => open()} class="bg-[#319cdf] flex h-full w-[70%] rounded-full items-center justify-center py-[13px] px-4 relative space-x-1"><img src="/wallet.webp" alt="connect" class="w-[16px] -mt-[1px]"/><div class="text-[13px] small-text2 font-medium text-left text-nowrap text-white flex flex-col" >Connect your wallet</div><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-[#fff] mb-[-1px]" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg></button>
  
      </div>
    
  
  )
}