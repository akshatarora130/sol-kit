import { Link } from "react-router";
import {
  FaRocket,
  FaSignature,
  FaPaperPlane,
  FaCoins,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {
  const features = [
    {
      title: "Airdrop SOL",
      description: "Get test SOL for development and testing",
      icon: <FaRocket className="w-6 h-6" />,
      path: "/airdrop",
      gradient: "from-[#576CBC] to-[#A5D7E8]",
      hoverGradient: "hover:from-[#576CBC]/90 hover:to-[#A5D7E8]/90",
    },
    {
      title: "Sign Message",
      description: "Sign messages with your wallet for authentication",
      icon: <FaSignature className="w-6 h-6" />,
      path: "/sign-message",
      gradient: "from-[#A5D7E8] to-[#576CBC]",
      hoverGradient: "hover:from-[#A5D7E8]/90 hover:to-[#576CBC]/90",
    },
    {
      title: "Send SOL",
      description: "Transfer SOL to other wallet addresses",
      icon: <FaPaperPlane className="w-6 h-6" />,
      path: "/send-token",
      gradient: "from-[#576CBC] to-[#A5D7E8]",
      hoverGradient: "hover:from-[#576CBC]/90 hover:to-[#A5D7E8]/90",
    },
    {
      title: "Create Token",
      description: "Create custom SPL tokens on Solana",
      icon: <FaCoins className="w-6 h-6" />,
      path: "/create-token",
      gradient: "from-[#A5D7E8] to-[#576CBC]",
      hoverGradient: "hover:from-[#A5D7E8]/90 hover:to-[#576CBC]/90",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaWallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Solana Toolkit
            </h1>
            <p className="text-gray-600 text-base font-medium max-w-xl mx-auto">
              A comprehensive suite of tools for Solana development and testing
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                to={feature.path}
                className="group block"
              >
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden h-full">
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 mx-auto">
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {feature.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                      <span className="text-xs font-semibold mr-1">
                        Explore
                      </span>
                      <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 relative z-10">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-2 font-medium">
                Powered by Solana Network
              </p>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-gray-700 text-xs font-bold">
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

export default Home;
