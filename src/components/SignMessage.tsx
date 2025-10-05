import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import { toast } from "react-toastify";
import {
  FaSignature,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const SignMessage = () => {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const onClick = async () => {
    if (!publicKey || !signMessage) {
      toast.error("Wallet not connected or signing not supported", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message to sign", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
      return;
    }

    setIsSigning(true);

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const sig = await signMessage(encodedMessage);

      if (!ed25519.verify(sig, encodedMessage, publicKey.toBytes())) {
        throw new Error("Message signature invalid!");
      }

      setMessage("");
      toast.success("Message signed successfully!", {
        icon: <FaCheckCircle className="text-green-400" />,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to sign message", {
        icon: <FaExclamationTriangle className="text-red-400" />,
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-gray-50 rounded-3xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FaSignature className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Sign Message
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Sign a message with your wallet
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Message Input */}
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-4">
                Enter Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-6 py-4 bg-white text-gray-800 placeholder-gray-400 rounded-2xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all duration-300 resize-none h-32 shadow-sm"
                disabled={isSigning}
              />
            </div>

            {/* Sign Button */}
            <button
              onClick={onClick}
              disabled={isSigning || !message.trim()}
              className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform relative overflow-hidden group ${
                isSigning || !message.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed scale-95"
                  : "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
            >
              {isSigning ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin h-7 w-7 mr-3" />
                  Signing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaSignature className="w-6 h-6 mr-3" />
                  Sign Message
                </div>
              )}
              {!isSigning && message.trim() && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>

            {/* Helper Text */}
            {!isSigning && (
              <div className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enter a message and click "Sign Message" to create a
                  cryptographic signature
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 relative z-10">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3 font-medium">
                Powered by Solana Network
              </p>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-gray-700 text-sm font-bold">
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

export default SignMessage;
