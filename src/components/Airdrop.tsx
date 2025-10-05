import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaSpinner,
  FaRocket,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaSync,
  FaLock,
} from "react-icons/fa";

const Airdrop = () => {
  const wallet = useWallet();
  const connection = useConnection().connection;
  const [airdropAmount, setAirdropAmount] = useState(0.1);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const airdrop = async () => {
    setIsAirdropping(true);
    setError("");
    setSuccess("");

    try {
      await connection.requestAirdrop(
        wallet.publicKey!,
        airdropAmount * LAMPORTS_PER_SOL
      );
      setSuccess(
        `${airdropAmount} SOL successfully airdropped to your wallet!`
      );
    } catch (error: any) {
      console.error("Airdrop error:", error);

      if (error.message && error.message.includes("429")) {
        setError(
          "Airdrop limit reached! You've either hit your daily limit or the faucet is out of funds. Please try again later or visit https://faucet.solana.com for alternate sources."
        );
      } else {
        setError(
          `Airdrop failed: ${error.message || "Unknown error occurred"}`
        );
      }
    } finally {
      setIsAirdropping(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-50 rounded-3xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FaDollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Solana Faucet
            </h1>
            <p className="text-gray-600 text-sm">
              Get test SOL for development
            </p>
          </div>

          {wallet.connecting ? (
            <div className="text-center py-12">
              <FaSpinner className="inline-block animate-spin text-4xl text-gray-600 mb-6" />
              <p className="text-gray-700 text-lg">Connecting wallet...</p>
            </div>
          ) : wallet.connected ? (
            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[0.1, 0.5, 1, 5].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAirdropAmount(amount)}
                      className={`px-4 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                        airdropAmount === amount
                          ? "bg-gray-600 text-white shadow-lg scale-105 ring-2 ring-gray-400"
                          : "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-800 hover:scale-105 border border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-bold">{amount}</span>
                        <span className="text-sm ml-1 opacity-80">SOL</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Airdrop Button */}
              <button
                disabled={isAirdropping}
                onClick={airdrop}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  isAirdropping
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed scale-95"
                    : "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {isAirdropping ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin h-6 w-6 mr-3" />
                    Airdropping...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaRocket className="w-5 h-5 mr-2" />
                    Request Airdrop
                  </div>
                )}
              </button>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-green-800 text-sm leading-relaxed">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-red-800 text-sm leading-relaxed">
                        {error}
                      </p>
                      {error.includes("faucet.solana.com") && (
                        <a
                          href="https://faucet.solana.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-3 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors group"
                        >
                          Visit Official Solana Faucet
                          <FaExternalLinkAlt className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Helper Text */}
              {!error && !success && !isAirdropping && (
                <div className="text-center">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Select an amount and click "Request Airdrop" to get test SOL
                    for development
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaLock className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Wallet Not Connected
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect your wallet to start airdropping SOL
              </p>
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Please use the wallet connection button above to connect your
                  Solana wallet
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-2">
                Powered by Solana Network
              </p>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-gray-700 text-xs font-medium">
                  Devnet Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
