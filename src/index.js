import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import NotAdmin236 from "./pages/NotAdmin236";
import { AuthContextProvider } from "./context/AuthContext";
import Leaderboard from "./pages/Leaderboard";
import DailyCheckIn from "./pages/Checkin"; 
import CryptoFarming from "./pages/Farm";
import Airdrop from "./pages/Airdrop";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import EditTasks from "./pages/admin/EditTasks";
import ExtrenalTasks from "./pages/admin/ExtrenalTasks";
import AdminAdvertTasks from "./pages/admin/AdminAdvertTasks";
import AirdropWallets from "./pages/admin/AdminWallets";
import Search from "./pages/admin/Search";
import Statistics from "./pages/admin/Statistics";
import AdminRanks from "./pages/admin/AdminRanks";
import AdminYoutube from "./pages/admin/AdminYoutube";
import AlphaDogs from "./pages/AlphaDogs";



import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import {bsc} from '@reown/appkit/networks';
import UserDashboard from "./Components/UsdtEarn/UserDashboard";
import Description from "./Components/UsdtEarn/Description";
import BalanceChecker from "./pages/BalanceChecker";


// 1. Get projectId
const projectId = 'c31091e9e72b74750760c0727a566acc'

// 2. Set the networks
const networks = [bsc,]

// 3. Create a metadata object - optional
const metadata = {
  name: 'RSC',
  description: 'DEFI APP',
  url: 'https://iter-link.com/usdtearn', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})







const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <AlphaDogs />,
      },
      {
        path:"/usdtearn",
        element: <UserDashboard />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/full-description",
        element: <Description/>
      },
      {
        path:"/airdrop",
        element: <Airdrop />,
      },
      {
        path:"/leaderboard",
        element: <Leaderboard />,
      },
      {
        path:"/checkin",
        element: <DailyCheckIn />,
      },
      {
        path:"/earn",
        element: <CryptoFarming/>,
      },
      {
        path:"/dashboardlogin",
        element: <NotAdmin236 />,
      },
    ]

  },
  {
    path: "/dashboardAdx",
    element: <Dashboard />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/dashboardAdx/settings",
        element: <Settings />,
      },
      {
        path:"/dashboardAdx/managetasks",
        element: <EditTasks />,
      },
      {
        path:"/dashboardAdx/externaltasks",
        element: <ExtrenalTasks />,
      },
      {
        path:"/dashboardAdx/promo",
        element: <AdminAdvertTasks />,
      },
      {
        path:"/dashboardAdx/youtube",
        element: <AdminYoutube />,
      },
      {
        path:"/dashboardAdx/airdroplist",
        element: <AirdropWallets />,
      },
      {
        path:"/dashboardAdx/ranks",
        element: <AdminRanks />,
      },
      {
        path:"/dashboardAdx/search",
        element: <Search />,
      },
      {
        path:"/dashboardAdx/stats",
        element: <Statistics />,
      },

    ]
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  
           

  <AuthContextProvider>
  <React.StrictMode>

  <RouterProvider router={router} />

 
   
  </React.StrictMode>
  
  </AuthContextProvider>


);
