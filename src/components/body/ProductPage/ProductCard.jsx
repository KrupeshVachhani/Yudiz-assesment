import { useState } from "react";
import PropTypes from "prop-types";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  selectedColors,
  onColorSelect,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    setQuantity(1);

    const existingItem = cart.items.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity >= 10) {
      toast.warning(
        `You can't add more than 10 of ${product.title} to the cart!`,
        {
          position: "top-center",
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        }
      );
      return;
    }

    const maxAddable = 10 - currentQuantity;
    const finalQuantity = quantity > maxAddable ? maxAddable : quantity;

    onAddToCart(product, finalQuantity);

    toast.success(
      `Added ${
        product.title
      } with quantity of ${finalQuantity} to cart successfully!${
        finalQuantity < quantity
          ? ` (Only ${finalQuantity} added due to limit)`
          : ""
      }`,
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
        transition: Bounce,
      }
    );
  };

  const handleColorClick = (e, colorName) => {
    e.stopPropagation();
    onColorSelect(product.id, colorName);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  // Premium card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.4,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow:
        "0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.07)",
      borderColor: "#000",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Premium image animation variants
  const imageVariants = {
    initial: { scale: 0.9, opacity: 0.7 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.12,
      transition: {
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0], // Expo ease out for smooth premium feel
      },
    },
  };

  // Premium gradient overlay animation
  const overlayVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 0.05,
      transition: { duration: 0.4 },
    },
  };

  // Button animation variants
  const buttonVariants = {
    initial: { y: 0, backgroundColor: "#f3f4f6", color: "#000" },
    hover: {
      y: -2,
      backgroundColor: "#000",
      color: "#fff",
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.97,
      y: 0,
      transition: { duration: 0.1 },
    },
  };

  // Quantity counter animations
  const counterButtonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.15,
      transition: { type: "spring", stiffness: 400, damping: 8 },
    },
    tap: { scale: 0.9 },
  };

  const quantityDisplayVariants = {
    initial: { scale: 1 },
    animate: (custom) => ({
      scale: [1, 1.2, 1],
      transition: { duration: 0.35, times: [0, 0.5, 1] },
    }),
  };

  return (
    <motion.div
      className="border rounded-lg p-4 border-gray-200 flex flex-col hover:cursor-pointer relative overflow-hidden"
      onClick={handleProductClick}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {/* Premium background gradient effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Badge for new products */}
      {product.isNew && (
        <motion.div
          className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full font-medium z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          NEW
        </motion.div>
      )}

      {/* Product image container */}
      <div className="flex justify-center items-center mb-4 overflow-hidden relative h-48 rounded-lg">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-lg z-0"
          variants={overlayVariants}
        />

        <motion.img
          src={product.image_url}
          alt={product.title}
          className="w-64 h-48 object-contain"
          variants={imageVariants}
          loading="lazy"
        />

        {/* Premium hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.08 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Product details */}
      <div className="flex flex-col items-start flex-grow relative z-10">
        <motion.h3
          className="text-sm font-semibold truncate mb-1 w-full"
          animate={{
            color: isHovered ? "#000" : "#374151",
            fontWeight: isHovered ? 700 : 600,
          }}
          transition={{ duration: 0.3 }}
        >
          {product.title}
        </motion.h3>

        <motion.p
          className="text-green-600 font-bold tracking-tight"
          animate={{
            scale: isHovered ? 1.08 : 1,
            y: isHovered ? -2 : 0,
            color: isHovered ? "#047857" : "#059669",
          }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          ${product.price}
        </motion.p>

        <motion.p
          className="text-xs text-gray-500 capitalize mb-3"
          animate={{ opacity: isHovered ? 0.9 : 0.7 }}
        >
          {product.category}
        </motion.p>

        {/* Color selection */}
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex gap-2">
            {product.colors &&
              product.colors.map((color, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => handleColorClick(e, color)}
                  className={`w-5 h-5 border rounded-full hover:cursor-pointer ${
                    selectedColors[product.id] === color
                      ? "ring-2 ring-offset-2 ring-gray-700"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  whileHover={{
                    scale: 1.25,
                    boxShadow:
                      "0 0 0 2px rgba(255,255,255,1), 0 0 0 4px " + color,
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  initial={{ opacity: 0.8, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow:
                      selectedColors[product.id] === color
                        ? "0 0 0 2px rgba(255,255,255,1), 0 0 0 4px " + color
                        : "none",
                  }}
                />
              ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center gap-1 my-2 relative">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              decrementQuantity();
            }}
            className="text-gray-800 w-8 h-8 flex items-center justify-center rounded"
            variants={counterButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <CiSquareMinus className="text-4xl" />
          </motion.button>

          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-8 flex items-center justify-center border-2 border-gray-700 rounded text-gray-800"
            variants={quantityDisplayVariants}
            custom={quantity}
            animate="animate"
            key={quantity}
          >
            {quantity}
          </motion.div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              incrementQuantity();
            }}
            className="text-gray-800 w-8 h-8 flex items-center justify-center rounded"
            variants={counterButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <CiSquarePlus className="text-4xl" />
          </motion.button>
        </div>

        {/* Add to cart button */}
        <motion.button
          onClick={handleAddToCartClick}
          className="w-full mt-3 bg-gray-100 border border-black text-black py-2 rounded"
          variants={buttonVariants}
          whileTap="tap"
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            Add to Cart
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  selectedColors: PropTypes.object.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
