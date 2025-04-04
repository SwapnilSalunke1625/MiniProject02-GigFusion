import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import RatingPage from "./RatingProjectPage.jsx";
import ReviewHome from "../components/ReviewsHome.jsx";
import HomePageOptions from "../components/HomePageOptions.jsx"
import SummeryVisualOnfront from "../Pages/SummeryVisualOnfront.jsx"
import Plumber from "../components/Assets/Icons/Home main serveices/Plumber.svg";
import HomeRepair from "../components/Assets/Icons/Home main serveices/HomeRepair.svg";
import Electrical from "../components/Assets/Icons/Home main serveices/Electrical.svg";
import Painting from "../components/Assets/Icons/Home main serveices/Painting.svg";
import Moving from "../components/Assets/Icons/Home main serveices/Moving.svg";
import Cleaning from "../components/Assets/Icons/Home main serveices/Cleaning.svg";
import Direction from "../components/Assets/Icons/Direction.svg";
import ServiceName from '../components/ServiceName';
import ServiceTypeCard from '../components/ServiceTypeCard';
import HowWorkFLowOnLanding from './HowWorkFLowOnLanding.jsx';
import FandQOnfrontPage from './FandQOnfrontPage.jsx';
import HomepageHeading from './HomepageHeading.jsx';
import HomepageFrontTopPhoto from "./../components/Assets/HomepageFrontTop01.jpg"
import { FaSearch } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";


export default function HomePage() {
  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    setRotation((prevRotation) => prevRotation + 120);
  };

  // added this one 
  const words = [
    "Find top gig experts near you...",
    "Your gig solution starts here",
    "Connect with gig talent instantly...",
    "Hire the best freelancers today...",
    "Discover skilled gig professionals...",
  ];
  const services = [
    "web development",
    "logo design",
    "video editing"
   
  ];
  
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track input focus

  useEffect(() => {
    if (isFocused) return; // Stop animation when input is focused

    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 50 : 100; // Speed up when deleting
    const delay = isDeleting && charIndex === 0 ? 1000 : typingSpeed; // Pause before erasing

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setText((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setIsDeleting(!isDeleting);
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1000); // Wait before deleting
        } else {
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, isFocused]);


  return (
    <>
      <div className='flex  flex-col  font-stdFont'>

      <div  
  style={{ backgroundImage: `url(${HomepageFrontTopPhoto})` }} 
  className="flex flex-col w-screen min-h-[calc(100vh-4rem)] font-stdFont bg-cover bg-center bg-no-repeat overflow-x-hidden"
>  
  {/* Headings in Hero Section */}
  <div >
    <HomepageHeading/>    
  </div>

  <div className="font-bold items-start flex flex-col flex-wrap px-4 lg:ml-10">                
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      className="text-xs sm:text-sm md:text-base lg:text-lg mt-2 sm:mt-3 md:mt-4 lg:mt-8 text-stdBlue font-medium lg:font-bold"
    >
      Connecting you with skilled{" "}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="font-bold bg-gradient-to-r from-[#FF9800] via-[#FF5722] to-[#FF3D00] text-transparent bg-clip-text"
      >
        Gig Experts
      </motion.span>{" "}  
      near you!
    </motion.p>            
  </div>

  {/* Search Bar Section */}
  <div className="w-full lg:w-auto lg:ml-12 mt-3 sm:mt-3 md:mt-4 lg:mt-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1, ease: "easeOut" }}
      className="flex justify-start"
    >
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          value={text}
          placeholder=""
          className="w-full px-5 py-3 text-base md:text-lg border border-[#2A3B5A] rounded-full shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-[#3A4E7A] focus:border-[#4A5E9A] 
          hover:border-[#3A4E7A] transition-all duration-300 
          text-[#223265] placeholder-[#2A3B5A] font-medium tracking-wide"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#3A4E7A] transition-all duration-300">
          <FaSearch className="w-7 h-7" />
        </button>
      </div>
    </motion.div>
  </div>

  {/* Buttons Section */}
  <div className="flex flex-wrap gap-4 lg:ml-10 lg:mt-5 w-full px-4">
    {services.map((service, index) => (
      <button
        key={index}
        className="flex items-center gap-2 px-4 py-2 border 
        border-stdBlue text-stdBlue rounded-xl text-lg font-semibold 
        transition-transform duration-300 hover:scale-105 hover:border-gray-300"
      >
        {service}
        <FaArrowRight className="text-sm" />
      </button>
    ))}
  </div>
</div>

{/* hero section is finished */}

{/* Home options page */}

<div className='lg:mt-5'>
    <HomePageOptions/>
  </div>
       
  <div className='lg:mt-5 flex items-center justify-center'>
    <RatingPage />    
  </div>

    {/* service type page start */}

    <div className="w-full ">
    <ServiceTypeCard />
  </div> 

  <div>
    <HowWorkFLowOnLanding/>
  </div> 

  <div className="flex flex-col items-center justify-center mt-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-4xl font-bold text-center drop-shadow-md 
        bg-gradient-to-r from-orange-500 to-orange-600 
        text-transparent bg-clip-text animate-pulse"
      >
        A Glimpse into Our Design Innovations
      </motion.h2>
      <SummeryVisualOnfront />
  </div>

  {/* new one start  */}

  
  <div className="flex flex-col items-center justify-center w-full text-stdBlue px-5 my-10 md:my-20">
    <h2 className="text-xl md:text-3xl text-center font-bold ">
     See what happy customers are saying about TradeConnect
     </h2>
  </div>

 

       

   


      




        <FandQOnfrontPage/>
      </div>
    </>
  );
}

