// HeroBanner.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HeroBanner = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[60vh] overflow-hidden rounded-2xl mb-6">
      <motion.img
        src="https://images.unsplash.com/photo-1585559606984-2030f1b15a3e"
        alt="Hero Banner"
        className="object-cover w-full h-full"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold mb-2 text-center"
        >
          Discover Premium Living
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-md md:text-lg text-center"
        >
          Explore our hand-picked luxury furniture collection
        </motion.p>
      </div>
    </div>
  );
};

export default HeroBanner;


