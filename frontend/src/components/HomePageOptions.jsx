import React from "react";
import { 
    FaCode, FaMobileAlt, FaPenNib, FaBullhorn, FaLanguage, FaVideo, FaRobot, FaMusic, 
    FaShoppingCart, FaDatabase, FaShieldAlt, FaCloud, FaServer, FaBriefcase, FaUserTie, 
    FaPaintBrush, FaChartLine, FaMicrochip, FaClipboardList 
} from "react-icons/fa";

export default function HomePageOptions() {
  const categories = [
    { name: "Web Development", icon: <FaCode /> },
    { name: "Mobile App Development", icon: <FaMobileAlt /> },
    { name: "Graphics & Design", icon: <FaPenNib /> },
    { name: "Digital Marketing", icon: <FaBullhorn /> },
    { name: "Content Writing", icon: <FaLanguage /> },
    { name: "Video & Animation", icon: <FaVideo /> },
    { name: "AI & Machine Learning", icon: <FaRobot /> },
    { name: "Music & Audio", icon: <FaMusic /> },
    { name: "E-commerce Development", icon: <FaShoppingCart /> },
    { name: "Database Administration", icon: <FaDatabase /> },
    { name: "Cybersecurity", icon: <FaShieldAlt /> },
    { name: "Cloud Computing", icon: <FaCloud /> },
    { name: "DevOps & Server Management", icon: <FaServer /> },
    { name: "Business & Finance", icon: <FaBriefcase /> },
    { name: "Consulting & Strategy", icon: <FaUserTie /> },
    { name: "UI/UX Design", icon: <FaPaintBrush /> },
    { name: "SEO & SEM", icon: <FaChartLine /> },
    { name: "Embedded Systems", icon: <FaMicrochip /> },
    { name: "Project Management", icon: <FaClipboardList /> }
  ];

  return (
    <div className="w-full bg-gray-100 py-6 overflow-hidden">
      <div className="flex w-max animate-marquee gap-6">
        {[...categories, ...categories].map((category, index) => (
          <div 
            key={index} 
            className="relative flex flex-col items-center justify-center p-6 w-48 h-40 bg-gradient-to-br 
                      from-white to-gray-100 rounded-xl shadow-lg 
                      transition-all duration-500 hover:scale-110 overflow-hidden group"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Running Border Effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:stdBlue">
              <div className="absolute inset-0 animate-border-run"></div>
            </div>

            <div className="text-4xl text-stdBlue group-hover:stdBlue transition-colors duration-300 mb-3">
              {category.icon}
            </div>
            <p className="text-center text-gray-900 font-semibold group-hover:stdBlue transition-all duration-300">
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {/* Tailwind Keyfnpmrames Animations */}
      <style>{`
        @keyframes border-run {
          0% {
            clip-path: inset(0 100% 100% 0);
          }
          25% {
            clip-path: inset(0 0 100% 0);
          }
          50% {
            clip-path: inset(0 0 0 100%);
          }
          75% {
            clip-path: inset(100% 0 0 0);
          }
          100% {
            clip-path: inset(0 100% 100% 0);
          }
        }
        
        .animate-border-run {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid #6366f1;
          animation: border-run 1.5s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
