import { useState, useEffect } from "react";

const ServiceName = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Enhanced services array with more vibrant gradients and animations
  const services = [
    {
      text: "Home Repairs",
      gradient: "from-blue-600 via-blue-500 to-blue-400",
      shadowColor: "shadow-blue-500/30",
      icon: "🏠"
    },
    {
      text: "Moving",
      gradient: "from-purple-600 via-purple-500 to-purple-400",
      shadowColor: "shadow-purple-500/30",
      icon: "🚚"
    },
    {
      text: "Electrical",
      gradient: "from-amber-500 via-yellow-500 to-yellow-400",
      shadowColor: "shadow-yellow-500/30",
      icon: "⚡"
    },
    {
      text: "Cleaning",
      gradient: "from-emerald-600 via-green-500 to-green-400",
      shadowColor: "shadow-green-500/30",
      icon: "✨"
    },
    {
      text: "Painting",
      gradient: "from-rose-600 via-pink-500 to-pink-400",
      shadowColor: "shadow-pink-500/30",
      icon: "🎨"
    },
    {
      text: "Plumbing",
      gradient: "from-cyan-600 via-blue-500 to-blue-400",
      shadowColor: "shadow-cyan-500/30",
      icon: "🔧"
    }
  ];

  const staticText = "Experience Excellence With Our";
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  useEffect(() => {
    let timeout;

    const animateText = () => {
      const currentService = services[currentServiceIndex].text;

      if (!isDeleting) {
        if (currentIndex < currentService.length) {
          setDisplayText(currentService.substring(0, currentIndex + 1));
          setCurrentIndex((prev) => prev + 1);
          timeout = setTimeout(animateText, typingSpeed);
        } else {
          timeout = setTimeout(() => {
            setIsDeleting(true);
            animateText();
          }, pauseTime);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText(currentService.substring(0, currentIndex - 1));
          setCurrentIndex((prev) => prev - 1);
          timeout = setTimeout(animateText, deletingSpeed);
        } else {
          setIsDeleting(false);
          setCurrentServiceIndex((prev) => (prev + 1) % services.length);
          timeout = setTimeout(animateText, typingSpeed);
        }
      }
    };

    timeout = setTimeout(animateText, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentServiceIndex]);

  return (
    <div className="w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] 
      flex flex-col items-center justify-center text-center 
      px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8
      space-y-3 sm:space-y-4 md:space-y-5
      relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white 
        opacity-50 pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 
            font-extrabold bg-gradient-to-r from-stdBlue via-blue-800 to-blue-950 
            bg-clip-text text-transparent leading-tight
            animate-gradient-x whitespace-nowrap
            tracking-tight sm:tracking-normal mb-2
            drop-shadow-sm transform hover:scale-105 transition-transform duration-300"
          aria-label={staticText}
        >
          {staticText}
        </h1>

        <div className="flex items-center justify-center h-[60px] sm:h-[70px] md:h-[80px]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl opacity-70 animate-bounce w-[30px] sm:w-[36px]">
              {services[currentServiceIndex].icon}
            </span>
            <span
              className={`text-3xl sm:text-4xl md:text-5xl
                font-bold bg-gradient-to-r ${services[currentServiceIndex].gradient} 
                bg-clip-text text-transparent transition-all duration-300 ease-in-out
                drop-shadow-lg ${services[currentServiceIndex].shadowColor}
                whitespace-nowrap min-w-[200px] sm:min-w-[250px] md:min-w-[300px]
                text-center
                transform hover:scale-105 transition-transform duration-300`}
            >
              {displayText}
            </span>
            <span
              className={`inline-block w-[2px] sm:w-[3px] h-7 sm:h-8 md:h-9 ml-1 
                ${isDeleting ? 'animate-pulse' : 'animate-blink'}
                bg-gradient-to-b ${services[currentServiceIndex].gradient}
                rounded-full shadow-lg`}
              aria-hidden="true"
            ></span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 
        w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
        rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 
        w-40 h-40 bg-gradient-to-l from-orange-500/10 to-pink-500/10 
        rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default ServiceName;
