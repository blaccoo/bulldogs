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
import { polygonAmoy } from '@reown/appkit/networks';
import UserDashboard from "./Components/UsdtEarn/UserDashboard";
import BalanceChecker from "./pages/BalanceChecker";


// Initialize AppKit
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [polygonAmoy],
  metadata: {
    name: 'My Website',
    description: 'My Website Description',
    url: 'https://mywebsite.com',
    icons: ['https://avatars.mywebsite.com/'],
  },
  projectId: '214f9c37ad0e68964fdc0d9372ee557c',
  features: {
    email: false, // default to true
    socials: [],
    emailShowWallets: true, // default to true
  },
  allWallets: 'SHOW', // default to SHOW
});








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
        path:"/test",
        element: <BalanceChecker/>
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
