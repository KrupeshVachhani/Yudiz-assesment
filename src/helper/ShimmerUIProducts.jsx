
// const ShimmerUIProducts = () => {
//   return (
//     <div className="container mx-auto px-16 mt-4">
//       <div className="mb-4 flex space-x-2 overflow-x-auto gap-1">
//         {Array(5).fill().map((_, index) => (
//           <div 
//             key={index} 
//             className="h-10 w-28 px-4 py-2 rounded capitalize bg-gray-300 animate-pulse"
//           >
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {Array(8).fill().map((_, index) => (
//           <div 
//             key={index} 
//             className="border rounded-lg p-4 animate-pulse"
//           >
//             <div className="h-48 bg-gray-300 mb-4"></div>
//             <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
//             <div className="h-4 bg-gray-300 w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ShimmerUIProducts;

// ShimmerUIProducts.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShimmerUIProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Offer data
  const offerData = [
    {
      title: "🔥 Deal of the Day",
      desc: "Get up to 40% off on ergonomic chairs",
      bg: "bg-gradient-to-r from-red-500 to-pink-500"
    },
    {
      title: "🌿 Eco Essentials",
      desc: "Sustainable wood crafted products",
      bg: "bg-gradient-to-r from-green-500 to-lime-500"
    },
    {
      title: "🛋️ Luxe Comforts",
      desc: "Premium sofas starting at just $499",
      bg: "bg-gradient-to-r from-blue-500 to-purple-500"
    }
  ];

  // Navigation links
  const navLinks = [
    { name: "Home", url: "#" },
    { name: "Shop", url: "#" },
    { name: "Collections", url: "#" },
    { name: "About", url: "#" },
    { name: "Contact", url: "#" }
  ];

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const heroContentVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const offerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const offerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return <ShimmerCombinedComponent />;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <motion.header 
        className="py-6 flex items-center justify-between"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <motion.div 
          className="text-2xl font-bold"
          variants={linkVariants}
        >
          LuxeFurniture
        </motion.div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((link, index) => (
              <motion.li key={index} variants={linkVariants}>
                <a 
                  href={link.url} 
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
        
        <motion.div 
          className="flex items-center space-x-4"
          variants={linkVariants}
        >
          <motion.button 
            className="text-gray-700 hover:text-blue-600 transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
          <motion.button 
            className="text-gray-700 hover:text-blue-600 transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Hero Banner */}
      <motion.div 
        className="relative h-[60vh] overflow-hidden rounded-2xl mb-6 mt-10"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
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
            variants={heroContentVariants}
            className="text-3xl md:text-5xl font-bold mb-2 text-center"
          >
            Discover Premium Living
          </motion.h1>
          <motion.p
            variants={heroContentVariants}
            className="text-md md:text-lg text-center"
          >
            Explore our hand-picked luxury furniture collection
          </motion.p>
          <motion.button
            variants={heroContentVariants}
            className="mt-6 bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.button>
        </div>
      </motion.div>

      {/* Offer Banners */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={offerVariants}
      >
        {offerData.map((offer, index) => (
          <motion.div
            key={index}
            className={`text-white p-6 rounded-xl shadow-lg cursor-pointer ${offer.bg}`}
            variants={offerItemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-xl font-semibold mb-1">{offer.title}</h3>
            <p className="text-sm opacity-90">{offer.desc}</p>
            <div className="mt-3 flex justify-end">
              <motion.span 
                className="text-sm font-medium"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, x: 3 }}
                transition={{ duration: 0.2 }}
              >
                View Offers →
              </motion.span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Shimmer version of the combined component
const ShimmerCombinedComponent = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Shimmer Header */}
      <div className="py-6 flex items-center justify-between">
        <div className="w-36 h-8 bg-gray-200 rounded relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="hidden md:flex space-x-8">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div 
              key={index}
              className="w-16 h-5 bg-gray-200 rounded relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                  delay: index * 0.1
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4">
          {[1, 2].map((_, index) => (
            <div 
              key={index}
              className="w-6 h-6 bg-gray-200 rounded-full relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                  delay: index * 0.1
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden rounded-2xl mb-6 mt-10 bg-gray-200">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-64 h-10 bg-gray-300 rounded-lg mb-4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
                delay: 0.1
              }}
            />
          </div>
          
          <div className="w-48 h-6 bg-gray-300 rounded-lg mb-6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
                delay: 0.2
              }}
            />
          </div>
          
          <div className="w-32 h-10 bg-gray-300 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
                delay: 0.3
              }}
            />
          </div>
        </div>
      </div>

      {/* Shimmer Offer Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((_, index) => (
          <div 
            key={index}
            className="h-32 rounded-xl bg-gray-200 relative overflow-hidden p-6"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
                delay: index * 0.2
              }}
            />
            
            <div className="relative">
              <div className="w-32 h-6 bg-gray-300 rounded mb-2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                    delay: index * 0.2 + 0.1
                  }}
                />
              </div>
              
              <div className="w-48 h-4 bg-gray-300 rounded relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                    delay: index * 0.2 + 0.2
                  }}
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <div className="w-24 h-4 bg-gray-300 rounded relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                      delay: index * 0.2 + 0.3
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShimmerUIProducts;