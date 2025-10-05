import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddressSync,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { useState } from "react";
import {
  FaCoins,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTag,
  FaHashtag,
  FaCog,
  FaImage,
} from "react-icons/fa";

const CreateToken = () => {
  const connection = useConnection().connection;
  const wallet = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenImageUrl, setTokenImageUrl] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(9);
  const [tokenSupply, setTokenSupply] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onClick = async () => {
    // Reset states
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Check wallet connection
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error(
          "Wallet not connected. Please connect your wallet first."
        );
      }

      if (!wallet.sendTransaction) {
        throw new Error("Wallet does not support sending transactions.");
      }

      // Validate decimals
      if (tokenDecimals < 1 || tokenDecimals > 9) {
        throw new Error("Token decimals must be between 1 and 9.");
      }

      // Validate token supply
      if (tokenSupply <= 0) {
        throw new Error("Token supply must be greater than 0.");
      }

      // Step 1: Create mint account
      const mintKeypair = Keypair.generate();
      const metadata = {
        mint: mintKeypair.publicKey,
        name: tokenName,
        symbol: tokenSymbol,
        uri:
          tokenImageUrl ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg600Xa4ws6jp54kMDNGYF232lIhY51QJqEA&s",
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      const createMintTransaction = new Transaction();
      createMintTransaction.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          tokenDecimals,
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: tokenName,
          symbol: tokenSymbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        })
      );

      // Set up transaction
      const { blockhash } = await connection.getLatestBlockhash();
      createMintTransaction.feePayer = wallet.publicKey;
      createMintTransaction.recentBlockhash = blockhash;
      createMintTransaction.partialSign(mintKeypair);

      await wallet.sendTransaction(createMintTransaction, connection);

      // Step 2: Create associated token account and mint tokens in one transaction
      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const mintAmount = tokenSupply * Math.pow(10, tokenDecimals);
      const createATAAndMintTransaction = new Transaction().add(
        // Create associated token account
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        // Mint tokens to the associated token account
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          mintAmount,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(createATAAndMintTransaction, connection);

      setSuccess(
        `Token created successfully! Mint: ${mintKeypair.publicKey.toString()}`
      );
    } catch (err) {
      console.error("Error creating token:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
      setTokenName("");
      setTokenSymbol("");
      setTokenImageUrl("");
      setTokenDecimals(9);
      setTokenSupply(0);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-50 rounded-3xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-4 relative z-10">
            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaCoins className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Token
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Create custom SPL tokens on Solana
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            {/* First Row: Token Name and Symbol */}
            <div className="grid grid-cols-2 gap-4">
              {/* Token Name Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Token Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all duration-300 shadow-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Token Symbol Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Token Symbol
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHashtag className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter symbol..."
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all duration-300 shadow-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Image URL Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Token Image URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={tokenImageUrl}
                  onChange={(e) => setTokenImageUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all duration-300 shadow-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Second Row: Token Decimals and Supply */}
            <div className="grid grid-cols-2 gap-4">
              {/* Token Decimals Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Decimals (1-9)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCog className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    placeholder="1-9"
                    value={tokenDecimals}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 9) {
                        setTokenDecimals(value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all duration-300 shadow-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Token Supply Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Token Supply
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCoins className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter supply"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all duration-300 shadow-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Helper text for decimals */}
            <div className="text-center">
              <p className="text-gray-500 text-xs">
                Decimals must be between 1 and 9 (default: 9)
              </p>
            </div>

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
                  </div>
                </div>
              </div>
            )}

            {/* Create Token Button */}
            <button
              onClick={onClick}
              disabled={
                isLoading ||
                !wallet.connected ||
                tokenDecimals < 1 ||
                tokenDecimals > 9 ||
                tokenSupply <= 0
              }
              className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform relative overflow-hidden group ${
                isLoading ||
                !wallet.connected ||
                tokenDecimals < 1 ||
                tokenDecimals > 9 ||
                tokenSupply <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed scale-95"
                  : "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin h-7 w-7 mr-3" />
                  Creating Token...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaCoins className="w-6 h-6 mr-3" />
                  Create Token
                </div>
              )}
              {!isLoading && wallet.connected && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>

            {/* Helper Text */}
            {!isLoading && (
              <div className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {!wallet.connected
                    ? "Connect your wallet to create a custom SPL token"
                    : tokenDecimals < 1 || tokenDecimals > 9 || tokenSupply <= 0
                    ? "Please enter valid token details (decimals: 1-9, supply > 0)"
                    : "Enter token details and click 'Create Token' to deploy"}
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

export default CreateToken;
