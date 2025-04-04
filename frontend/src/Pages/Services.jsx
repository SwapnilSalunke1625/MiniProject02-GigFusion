import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import { 
    FiTool, FiTruck, FiZap, FiWind, 
    FiDroplet, FiPackage, FiSearch, FiChevronRight, FiX, FiCode, FiDatabase, FiCloud, FiServer, FiMonitor, FiShield,
} from 'react-icons/fi';
import { useState } from 'react';
import serviceback from "../components/Assets/serviceback.png";
import BackButton from '../components/BackButton';
import Video01 from "./../components/Assets/Videos/ServicePageBgVideo.mp4"
import CountDownNumbersForServicePage from '../components/CountDownNumbersForServicePage';



const style = document.createElement('style');

style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
        }
        to { 
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }

    .animate-slideIn {
        animation: slideIn 0.4s ease-out;
    }

    .animate-slideInFromLeft {
        animation: slideInFromLeft 0.5s ease-out;
    }

    .animate-slideInFromRight {
        animation: slideInFromRight 0.5s ease-out;
    }

    .animate-slideInFromBottom {
        animation: slideInFromBottom 0.5s ease-out;
    }
`;
document.head.appendChild(style);

export default function Services() {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null);

    const mainServices = [
        {
            title: "Software Engineer",
            icon: <FiCode className="text-color1" size={32} />,
            description: "Building innovative software solutions tailored to your needs.",
            bgImage: "bg-gradient-to-br from-blue-50 to-blue-100"
        },
        {
            title: "Business Consultant",
            icon: <FiCloud className="text-stdBlue" size={32} />,
            description: "Providing strategic insights and solutions for business growth.",
            bgImage: "bg-gradient-to-br from-orange-50 to-orange-100"
        },
        {
            title: "Data Analyst",
            icon: <FiDatabase className="text-color1" size={32} />,
            description: "Transforming raw data into valuable insights for informed decision-making.",
            bgImage: "bg-gradient-to-br from-yellow-50 to-yellow-100"
        },
        {
            title: "IT Administrator",
            icon: <FiServer className="text-stdBlue" size={32} />,
            description: "Managing and maintaining IT infrastructure for seamless operations.",
            bgImage: "bg-gradient-to-br from-green-50 to-green-100"
        },
        {
            title: "Cybersecurity Specialist",
            icon: <FiShield className="text-color1" size={32} />,
            description: "Protecting digital assets with advanced security solutions.",
            bgImage: "bg-gradient-to-br from-purple-50 to-purple-100"
        },
        {
            title: "Content Creator",
            icon: <FiMonitor className="text-stdBlue" size={32} />,
            description: "Crafting engaging digital content for brands and audiences.",
            bgImage: "bg-gradient-to-br from-red-50 to-red-100"
        }
    ];

    const serviceDetails = {
       "Software Engineer": [
    "Web Application Development",
    "Mobile App Development",
    "Software Architecture Design",
    "API Development and Integration",
    "Database Design and Optimization",
    "Cloud Computing and Deployment",
    "Bug Fixing and Code Optimization",
    "Automation and Scripting",
    "Version Control and CI/CD Implementation",
    "Cybersecurity and Secure Coding Practices"
],

"Business Consultant": [
    "Market Research and Analysis",
    "Business Strategy Development",
    "Financial Planning and Budgeting",
    "Process Optimization and Efficiency Improvement",
    "Risk Assessment and Mitigation",
    "Startup Mentorship and Advisory",
    "Competitive Analysis",
    "Sales and Marketing Strategy",
    "Growth and Expansion Planning",
    "Client Relationship Management"
],

"Data Analyst": [
    "Data Collection and Cleaning",
    "Data Visualization and Reporting",
    "Statistical Analysis and Modeling",
    "Predictive Analytics",
    "Business Intelligence Implementation",
    "Dashboard Creation and Maintenance",
    "ETL (Extract, Transform, Load) Processes",
    "Customer and Market Trend Analysis",
    "Database Management and Optimization",
    "Decision Support through Data Insights"
],

"IT Administrator": [
    "Network Setup and Configuration",
    "Server Installation and Maintenance",
    "Cloud Infrastructure Management",
    "Security and Firewall Implementation",
    "Backup and Disaster Recovery Planning",
    "User Account and Access Control Management",
    "Software and Hardware Troubleshooting",
    "System Performance Monitoring",
    "IT Policy and Compliance Management",
    "Technical Support and Helpdesk Services"
],

"Cybersecurity Specialist": [
    "Network Security Monitoring",
    "Penetration Testing and Vulnerability Assessment",
    "Incident Response and Threat Mitigation",
    "Security Compliance Audits",
    "Data Encryption and Privacy Protection",
    "Firewall and Intrusion Detection Management",
    "Risk Assessment and Security Policy Implementation",
    "Secure Software Development Practices",
    "Cloud Security Management",
    "Employee Cybersecurity Training"
],

"Content Creator": [
    "Video Production and Editing",
    "Social Media Content Creation",
    "Graphic Design and Branding",
    "SEO Optimization for Digital Content",
    "Blog Writing and Copywriting",
    "Podcast Hosting and Production",
    "Influencer Marketing and Brand Partnerships",
    "Photography and Visual Storytelling",
    "YouTube and Streaming Channel Management",
    "Scriptwriting and Storyboarding"
]

    };

    const handleServiceClick = (title) => {
        setSelectedService(title);
    };

    const closeModal = () => {
        setSelectedService(null);
    };

    const handleBookNow = () => {
        navigate('/login');
    };

    return (
        <>
        <div className="min-h-screen bg-gray-50">
        {/* <BackButton /> */}
            {/* Hero Section */}

            {/* video */}
            <div className="relative h-[calc(100vh-80px)] overflow-hidden">
    <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover brightness-50"
    >
        <source src={Video01} type="video/mp4" />
        Your browser does not support the video tag.
    </video>

    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">
            Gig Experts Services
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-2xl ">
        You bring the skill. We'll make earning easy.
        </p>
        <div className="mt-8 flex items-center gap-4">
        <motion.button 
    onClick={() => navigate('/login')}
    className="px-12 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full 
               hover:from-indigo-600 hover:to-blue-500 transform hover:scale-105 
               transition-all duration-300 shadow-lg flex items-center gap-2 relative overflow-hidden"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
>
    <span className="relative z-10 text-xl font-bold">
        Join Us
    </span>
    <motion.span 
        className="relative z-10 text-xl"
        animate={{ x: [0, 5, 0] }} 
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
    >
        →
    </motion.span>
</motion.button>
        </div>
     
       

    
      
    </div>
</div>

<div>
<CountDownNumbersForServicePage/>
    
</div>


    

            {/* Main Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-stdBlue mb-12">
                Top-Tier Specialists
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mainServices.map((service, index) => (
                        <div
                            key={index}
                            onClick={() => handleServiceClick(service.title)}
                            className={`${service.bgImage} rounded-2xl p-6 shadow-lg hover:shadow-xl 
                                      transform hover:-translate-y-1 transition-all duration-300 
                                      cursor-pointer group`}
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-white shadow-md 
                                            group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-stdBlue">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600">
                                    {service.description}
                                </p>
                                <span className="inline-flex items-center text-color1 font-semibold">
                                    Book Now
                                    <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Service Details Modal */}
                {selectedService && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 
                                   animate-fadeIn"
                        onClick={closeModal}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative 
                                       transform transition-all duration-300 animate-slideIn"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                                         transition-colors hover:rotate-90 transform duration-300"
                            >
                                <FiX size={24} />
                            </button>
                            
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6 animate-slideInFromLeft">
                                    <div className={`p-3 rounded-full ${
                                        mainServices.find(s => s.title === selectedService)?.bgImage
                                    } transform hover:scale-110 transition-transform duration-300`}>
                                        {mainServices.find(s => s.title === selectedService)?.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-stdBlue">
                                        {selectedService}
                                    </h3>
                                </div>

                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 animate-slideInFromRight">
                                    <h4 className="text-lg font-semibold text-color1">
                                    Where Expertise Meets Excellence
                                    </h4>
                                    <ul className="space-y-3">
                                        {serviceDetails[selectedService].map((task, index) => (
                                            <li 
                                                key={index}
                                                className="flex items-start gap-3 text-gray-600 transform transition-all duration-300
                                                         hover:translate-x-2 hover:text-stdBlue"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: 'slideInFromBottom 0.5s ease forwards'
                                                }}
                                            >
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-color1 mt-2 
                                                      transform transition-all duration-300 
                                                      group-hover:scale-150"></div>
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 flex justify-end animate-slideInFromBottom">
                                    <button
                                        onClick={handleBookNow}
                                        className="bg-color1 text-white px-6 py-2.5 rounded-full
                                                 hover:bg-color1/90 transform hover:scale-105 
                                                 transition-all duration-300 shadow-md hover:shadow-xl
                                                 flex items-center gap-2"
                                    >
                                        Book Now
                                        <FiChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust Indicators */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { icon: <FiTool size={32} />, text: "Expert Professionals" },
                        { icon: <FiSearch size={32} />, text: "Easy Booking" },
                        { icon: <FiPackage size={32} />, text: "Quality Service" },
                        { icon: <FiTruck size={32} />, text: "Timely Delivery" }
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-3 p-4">
                            <div className="text-color1">
                                {item.icon}
                            </div>
                            <span className="font-semibold text-stdBlue">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}