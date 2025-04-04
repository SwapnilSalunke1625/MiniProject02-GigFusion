import { useEffect, useRef } from 'react';

const LoadingBar = () => {
    const loadingBarRef = useRef(null);

    useEffect(() => {
        const loadingBar = loadingBarRef.current;
        let progress = 0;
        let isIncreasing = true;

        const animate = () => {
            if (isIncreasing) {
                progress += 1;
                if (progress >= 90) {
                    isIncreasing = false;
                }
            } else {
                progress += 0.1;
                if (progress >= 98) {
                    progress = 98;
                }
            }

            if (loadingBar) {
                loadingBar.style.width = `${progress}%`;
            }
        };

        const intervalId = setInterval(animate, 20);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[9999]">
            <div
                ref={loadingBarRef}
                className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 
                    transition-all duration-300 ease-out origin-left
                    animate-pulse shadow-lg shadow-orange-500/50"
                style={{ width: '0%' }}
            >
                <div className="absolute top-0 right-0 h-full w-24 
                    bg-gradient-to-l from-white/20 to-transparent 
                    animate-shimmer"
                ></div>
            </div>
        </div>
    );
};

export default LoadingBar; 