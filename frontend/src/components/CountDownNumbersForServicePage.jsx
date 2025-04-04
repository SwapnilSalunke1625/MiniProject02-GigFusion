import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const CountDownNumbersForServicePage = () => {
    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setStartCount(true);
        }, 500);
    }, []);

    const stats = [
        { title: "Services Completed", value: 10000, suffix: "+" },
        { title: "Happy Customers", value: 25000, suffix: "+" },
        { title: "Service Providers", value: 5000, suffix: "+" },
        { title: "Response Time", value: 30, suffix: "s" },
    ];

    return (
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white py-6">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="text-center"
                    >
                        <p className="text-lg font-medium">{stat.title}</p>
                        <h2 className="text-4xl font-bold">
                            {startCount && <CountUp end={stat.value} duration={2} />} {stat.suffix}
                        </h2>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CountDownNumbersForServicePage;
