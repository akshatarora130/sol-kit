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
    <div className="min-h-screen bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#0B2447] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-gradient-to-br from-[#19376D]/90 to-[#0B2447]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[#576CBC]/40 p-6 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#A5D7E8]/10 to-[#576CBC]/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#576CBC]/10 to-[#A5D7E8]/10 rounded-full blur-xl"></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-[#576CBC] to-[#A5D7E8] rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl ring-2 ring-[#576CBC]/20">
              <FaWallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A5D7E8] to-[#576CBC] bg-clip-text text-transparent mb-2">
              Solana Toolkit
            </h1>
            <p className="text-[#A5D7E8]/80 text-base font-medium max-w-xl mx-auto">
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
                <div className="bg-gradient-to-br from-[#19376D]/60 to-[#0B2447]/60 rounded-xl p-4 border-2 border-[#576CBC]/30 hover:border-[#A5D7E8]/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden h-full">
                  {/* Card background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 mx-auto`}
                    >
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#A5D7E8] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-[#A5D7E8]/70 text-sm leading-relaxed mb-3">
                        {feature.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center text-[#A5D7E8] group-hover:text-white transition-colors duration-300">
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
          <div className="mt-8 pt-4 border-t border-[#576CBC]/40 relative z-10">
            <div className="text-center">
              <p className="text-[#A5D7E8]/70 text-xs mb-2 font-medium">
                Powered by Solana Network
              </p>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-r from-[#A5D7E8] to-[#576CBC] rounded-full mr-2 animate-pulse shadow-lg"></div>
                <span className="text-[#A5D7E8] text-xs font-bold">
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
