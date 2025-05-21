import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const SearchPreview = ({ query, products }) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!query || filtered.length === 0) return;
      
      // Handle arrow key navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filtered.slice(0, 6).length - 1) ? prev + 1 : prev);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0) ? prev - 1 : prev);
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        navigate(`/product/${filtered[selectedIndex].id}`);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query, filtered, selectedIndex, navigate]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  if (!query || filtered.length === 0) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -30,
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.1
      }
    },
    hover: { 
      scale: 1.12,
      rotate: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="bg-white shadow-2xl rounded-xl w-full max-h-96 overflow-y-auto mt-2 z-50 border border-gray-100"
        initial="hidden"
        animate="show"
        exit="exit"
        variants={containerVariants}
        layout
      >
        {filtered.slice(0, 6).map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
            className={`${selectedIndex === index ? "bg-blue-50" : ""}`}
          >
            <Link
              to={`/product/${product.id}`}
              className="flex items-center gap-4 p-4 transition-all duration-200"
            >
              <motion.div
                className="relative overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.img
                  src={product?.image_url || "/api/placeholder/64/64"}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                  variants={imageVariants}
                  whileHover="hover"
                />
              </motion.div>
              <motion.div 
                className="flex-1"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
              >
                <motion.p 
                  className="text-sm font-semibold text-gray-800 truncate"
                  layout
                >
                  {product.title}
                </motion.p>
                <motion.p 
                  className="text-xs text-gray-500 line-clamp-2"
                  layout
                >
                  {product.description?.slice(0, 50)}
                  {product.description?.length > 50 ? "..." : ""}
                </motion.p>
                <motion.p 
                  className="text-sm font-medium text-blue-600 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.4, duration: 0.3 }}
                >
                  ₹{product.price}
                </motion.p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

SearchPreview.propTypes = {
  query: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
};

export default SearchPreview;