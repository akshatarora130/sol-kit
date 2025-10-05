import { useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Airdrop from "./components/Airdrop";
import { FaDollarSign, FaSync } from "react-icons/fa";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import SignMessage from "./components/SignMessage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendToken from "./components/SendToken";
import CreateToken from "./components/CreateToken";
import Home from "./components/Home";

const WalletControls = () => {
  const wallet = useWallet();
  const connection = useConnection().connection;
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBalance = async () => {
    if (wallet.publicKey) {
      try {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBalance();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchBalance();
      // Refresh balance every 15 seconds
      const interval = setInterval(fetchBalance, 15000);
      return () => clearInterval(interval);
    }
  }, [wallet.connected]);

  return (
    <>
      {/* Balance Display */}
      {wallet.connected && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-600">
                <FaDollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-gray-700 text-sm font-medium">
                  Wallet Balance
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {balance.toFixed(4)}
                </div>
                <div className="text-gray-600 text-sm font-medium">SOL</div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh Balance"
              >
                <FaSync
                  className={`w-4 h-4 text-white group-hover:text-gray-200 transition-colors ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="relative">
            {/* Wallet Buttons - Fixed Position */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
              <div className="flex gap-3">
                <WalletMultiButton className="!bg-gradient-to-r !from-[#576CBC] !to-[#A5D7E8] hover:!from-[#576CBC]/90 hover:!to-[#A5D7E8]/90 !text-white !rounded-2xl !font-bold !px-6 !py-3 !transition-all !duration-300 hover:!scale-105 !shadow-xl hover:!shadow-2xl !border-0" />
                <WalletDisconnectButton className="!bg-gradient-to-r !from-[#19376D] !to-[#0B2447] hover:!from-[#19376D]/90 hover:!to-[#0B2447]/90 !text-[#A5D7E8] !rounded-2xl !font-bold !px-6 !py-3 !transition-all !duration-300 hover:!scale-105 !shadow-xl hover:!shadow-2xl !border !border-[#576CBC]/40 hover:!border-[#A5D7E8]/60" />
              </div>
              <WalletControls />
            </div>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/airdrop" element={<Airdrop />} />
                <Route path="/sign-message" element={<SignMessage />} />
                <Route path="/send-token" element={<SendToken />} />
                <Route path="/create-token" element={<CreateToken />} />
              </Routes>
            </BrowserRouter>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              toastStyle={{
                background: "linear-gradient(135deg, #19376D 0%, #0B2447 100%)",
                border: "1px solid #576CBC",
                color: "#A5D7E8",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
