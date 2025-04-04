import { FiMail, FiPhone, FiYoutube, FiHome, FiInfo, FiTool, FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import gigFusionlogo from "../components/Assets/gigFusionlogo.png";

function Footer() {
  const quickLinks = [
    { icon: <FiHome size={18} />, text: "Home", path: "/" },
    { icon: <FiInfo size={18} />, text: "About us", path: "/about" },
    { icon: <FiTool size={18} />, text: "Services", path: "/services" },
    { icon: <FiLogIn size={18} />, text: "Login", path: "/login" },
  ];

  const contactInfo = [
    { icon: <FiMail size={18} />, text: "GigFusion@gmail.com" },
    { icon: <FiPhone size={18} />, text: "+91 1800 130 200" },
    { icon: <FiYoutube size={18} />, text: "www.GigFusion.youtube.com" },
  ];

  return (
    <footer className="bg-gradient-to-r from-stdBlue to-blue-900 py-8 md:py-12 mt-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section - Enhanced with interactive effects */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-color1 to-stdBlue opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <img
                src={gigFusionlogo}
                alt="GigFusion Logo"
                className="relative h-[80px] md:h-[100px] w-auto object-contain rounded-2xl 
                         bg-white p-3 shadow-lg 
                         transform transition-all duration-300 ease-in-out
                         hover:scale-105 hover:rotate-2 
                         cursor-pointer
                         hover:shadow-xl hover:shadow-color1/20
                         group-hover:translate-y-[-5px]"
              />
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg 
                          transform transition-all duration-300 
                          hover:scale-105 hover:bg-white
                          group cursor-pointer">
              <p className="text-color1 text-sm md:text-base font-semibold text-center
                          group-hover:text-stdBlue transition-colors duration-300">
                Connecting Skills with Opportunities
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Quick Links
            </h2>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="flex items-center gap-2 text-gray-200 hover:text-color1 transition-colors duration-200 justify-center md:justify-start group"
                >
                  <span className="transform group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  <span className="text-base md:text-lg font-medium">{link.text}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Contact us
            </h2>
            <div className="flex flex-col space-y-3">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-200 justify-center md:justify-start group"
                >
                  <span className="transform group-hover:scale-110 transition-transform duration-200 text-color1">
                    {info.icon}
                  </span>
                  <span className="text-base md:text-lg font-medium">{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} GigFusion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;