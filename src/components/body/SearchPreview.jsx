import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SearchPreview = ({ query, products }) => {
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
  );

  if (!query || filtered.length === 0) return null;

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="bg-white shadow-2xl rounded-xl w-full max-h-[400px] overflow-y-auto mt-2 z-50 border border-gray-100"
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
          custom={index}
          whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
          >
            {console.log('product', product)}
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
                src={product?.image_url}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                whileHover={{ 
                  scale: 1.12,
                  transition: { duration: 0.3 }
                }}
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
                {product.description?.slice(0, 50)}...
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
  );
};

SearchPreview.propTypes = {
  query: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
};

export default SearchPreview;
