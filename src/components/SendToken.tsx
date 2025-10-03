import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWallet,
} from "react-icons/fa";

const SendToken = () => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = useConnection().connection;
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onClick = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not connected or transaction not supported", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
      return;
    }

    if (!recipientAddress.trim()) {
      toast.error("Please enter a recipient address", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
      return;
    }

    try {
      // Validate recipient address
      new PublicKey(recipientAddress);
    } catch (error) {
      toast.error("Invalid recipient address", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
      return;
    }

    setIsSending(true);

    try {
      const balance = await connection.getBalance(publicKey);
      const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (balance < amountInLamports) {
        toast.error("Insufficient balance", {
          icon: <FaExclamationTriangle className="text-red-400" />,
        });
        return;
      }

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: amountInLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      toast.success(
        `Successfully sent ${amount} SOL to ${recipientAddress.slice(
          0,
          8
        )}...${recipientAddress.slice(-8)}`,
        {
          icon: <FaCheckCircle className="text-green-400" />,
        }
      );

      // Clear form
      setRecipientAddress("");
      setAmount("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send transaction", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#0B2447] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-br from-[#19376D]/90 to-[#0B2447]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#576CBC]/40 p-8 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A5D7E8]/10 to-[#576CBC]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#576CBC]/10 to-[#A5D7E8]/10 rounded-full blur-2xl"></div>

          {/* Header */}
          <div className="text-center mb-4 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-r from-[#576CBC] to-[#A5D7E8] rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl ring-4 ring-[#576CBC]/20">
              <FaPaperPlane className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A5D7E8] to-[#576CBC] bg-clip-text text-transparent mb-3">
              Send SOL
            </h1>
            <p className="text-[#A5D7E8]/80 text-base font-medium">
              Transfer SOL to another wallet
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Recipient Address Input */}
            <div>
              <label className="block text-lg font-bold text-[#A5D7E8] mb-4">
                Recipient Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaWallet className="w-5 h-5 text-[#A5D7E8]/60" />
                </div>
                <input
                  type="text"
                  placeholder="Enter recipient wallet address..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gradient-to-r from-[#19376D]/60 to-[#0B2447]/60 text-[#A5D7E8] placeholder-[#A5D7E8]/50 rounded-2xl border-2 border-[#576CBC]/40 focus:border-[#A5D7E8]/60 focus:outline-none transition-all duration-300 shadow-lg"
                  disabled={isSending}
                />
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-lg font-bold text-[#A5D7E8] mb-4">
                Amount (SOL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#A5D7E8]/60 font-bold mr-2">SOL</span>
                </div>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gradient-to-r from-[#19376D]/60 to-[#0B2447]/60 text-[#A5D7E8] placeholder-[#A5D7E8]/50 rounded-2xl border-2 border-[#576CBC]/40 focus:border-[#A5D7E8]/60 focus:outline-none transition-all duration-300 shadow-lg"
                  disabled={isSending}
                />
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={onClick}
              disabled={isSending || !recipientAddress.trim() || !amount}
              className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform relative overflow-hidden group ${
                isSending || !recipientAddress.trim() || !amount
                  ? "bg-gradient-to-r from-[#19376D]/50 to-[#0B2447]/50 text-[#A5D7E8]/50 cursor-not-allowed scale-95"
                  : "bg-gradient-to-r from-[#576CBC] to-[#A5D7E8] hover:from-[#576CBC]/90 hover:to-[#A5D7E8]/90 text-white shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95"
              }`}
            >
              {isSending ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin h-7 w-7 mr-3" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaPaperPlane className="w-6 h-6 mr-3" />
                  Send SOL
                </div>
              )}
              {!isSending && recipientAddress.trim() && amount && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>

            {/* Helper Text */}
            {!isSending && (
              <div className="text-center">
                <p className="text-[#A5D7E8]/60 text-sm leading-relaxed">
                  Enter recipient address and amount to send SOL
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[#576CBC]/40 relative z-10">
            <div className="text-center">
              <p className="text-[#A5D7E8]/70 text-sm mb-3 font-medium">
                Powered by Solana Network
              </p>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-r from-[#A5D7E8] to-[#576CBC] rounded-full mr-3 animate-pulse shadow-lg"></div>
                <span className="text-[#A5D7E8] text-sm font-bold">
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

export default SendToken;
