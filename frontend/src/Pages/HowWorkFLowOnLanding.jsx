import React from 'react'
import { FiMessageCircle, FiZap, FiHome } from 'react-icons/fi';
import { motion } from "framer-motion";

export default function HowWorkFLowOnLanding() {
    const steps = [
        {
          icon: <FiMessageCircle size={32} />, title: "1. Tell us what your home needs",
          description: "From routine maintenance and repairs to dream home renovations, we can help with any project big or small.",
          bgColor: "bg-color1/20", iconColor: "text-color1"
        },
        {
          icon: <FiZap size={32} />, title: "2. We'll match you with personalized solutions",
          description: "See your price and book services in an instant. Or, request and compare quotes from highly rated pros near you.",
          bgColor: "bg-stdBlue/20", iconColor: "text-stdBlue"
        },
        {
          icon: <FiHome size={32} />, title: "3. Start to finish, we've got you covered",
          description: "When you book and pay with SewaSetu, you're covered by our Happiness Guarantee.",
          bgColor: "bg-color1/20", iconColor: "text-color1"
        }
      ];
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 overflow-hidden">
    <h2 className="text-3xl md:text-4xl font-bold text-stdBlue text-center mb-12">
      How it works
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className="group bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 }}
        >
          {/* Icon Wrapper */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center text-justify">
            <motion.div
              className={`absolute inset-0 ${step.bgColor} rounded-full animate-pulse`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
            <motion.div
              className={`relative z-10 flex items-center  justify-center w-16 h-16 ${step.iconColor}`}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              {step.icon}
            </motion.div>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-stdBlue group-hover:text-color1 text-center">
            {step.title}
          </h3>
          <p className="text-gray-600 group-hover:text-gray-800 text-center">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
  
  )
}
