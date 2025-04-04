import { motion } from "framer-motion";

export default function HomepageHeading() {
  return (
    <div className="flex flex-col px-4 mt-4 sm:mt-6 md:mt-10 lg:mt-16">
      {/* Main Heading with Smooth Animation & Subtle Shadow */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-stdBlue font-bold drop-shadow-md lg:ml-10"
      >
        Powering the Future of Work
      </motion.h2>

      {/* Subheading with Unique Orange-Themed Gig-Fusion */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-3 text-stdBlue font-semibold drop-shadow-sm lg:ml-10 lg:mt-5"
      >
        with
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="ml-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#FF9800] via-[#FF5722] to-[#FF3D00] text-transparent bg-clip-text drop-shadow-sm"
        >
          Gig-Fusion
        </motion.span>
      </motion.h2>
    </div>
  );
}
