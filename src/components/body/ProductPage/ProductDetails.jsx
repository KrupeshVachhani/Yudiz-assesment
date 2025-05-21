import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/CartSlice";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategorySuggestions from "../../suggestions";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import productData from "../../../Data.json";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Find product from local data
    const foundProduct = productData.find(item => item.id === parseInt(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default color if colors exist
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
    }
    
    setIsLoading(false);

    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = (e) => {
    if (product) {
      dispatch(addToCart({ ...product, selectedColor, quantity }));
      setQuantity(1);
      e.stopPropagation();
      
      // Add animated product to cart effect
      const productElement = document.querySelector(".product-image");
      const cartButton = document.querySelector(".cart-button");
      
      if (productElement && cartButton) {
        const productRect = productElement.getBoundingClientRect();
        const cartRect = cartButton.getBoundingClientRect();
        
        const clone = document.createElement("div");
        clone.style.position = "fixed";
        clone.style.zIndex = "9999";
        clone.style.width = "80px";
        clone.style.height = "80px";
        clone.style.backgroundImage = `url(${product.image_url})`;
        clone.style.backgroundSize = "contain";
        clone.style.backgroundPosition = "center";
        clone.style.backgroundRepeat = "no-repeat";
        clone.style.borderRadius = "50%";
        clone.style.left = `${productRect.left + productRect.width/2 - 40}px`;
        clone.style.top = `${productRect.top + productRect.height/2 - 40}px`;
        clone.style.transition = "all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
        
        document.body.appendChild(clone);
        
        setTimeout(() => {
          clone.style.left = `${cartRect.left + cartRect.width/2 - 15}px`;
          clone.style.top = `${cartRect.top + cartRect.height/2 - 15}px`;
          clone.style.width = "30px";
          clone.style.height = "30px";
          clone.style.opacity = "0.2";
        }, 10);
        
        setTimeout(() => {
          document.body.removeChild(clone);
        }, 800);
      }
      
      toast.success(
        `Added ${product.title} with quantity of ${quantity} to cart successfully!`,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading)
    return (
      <motion.div 
        className="container mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );

  if (!product)
    return (
      <motion.div 
        className="container mx-auto p-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-red-500 mb-4">Product not found</div>
        <motion.button
          onClick={() => navigate('/')}
          className="text-gray-800 hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go To Main Page
        </motion.button>
      </motion.div>
    );

  return (
    <motion.div 
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      data-barba="container"
      data-barba-namespace="product-detail"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="flex justify-center items-center bg-white rounded-lg p-4 overflow-hidden"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { delay: 0.3, duration: 0.5 }
            }}
          >
            <motion.img
              className="max-w-full h-auto max-h-[500px] object-contain product-image"
              src={product.image_url}
              alt={product.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              layoutId={`product-image-${product.id}`}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="space-y-6 text-gray-800"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {product.title}
          </motion.h1>
          
          <motion.p 
            className="text-2xl font-semibold"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            ${product.price}
          </motion.p>
          
          <motion.p 
            className="text-gray-600 leading-relaxed"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {product.description}
          </motion.p>

          {product.colors && product.colors.length > 0 && (
            <motion.div 
              className="space-y-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2 className="font-semibold">Select Color</h2>
              <div className="flex space-x-3">
                {product.colors.map((color, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 border rounded-full transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-gray-500"
                        : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            className="space-y-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h2 className="font-semibold">Quantity</h2>
            <div className="flex items-center gap-1 my-3">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  decrementQuantity();
                }}
                className="text-gray-800 w-8 h-8 flex items-center justify-center rounded hover:cursor-pointer"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.95 }}
              >
                <CiSquareMinus className="text-4xl" />
              </motion.button>
              <motion.div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-10 h-8 flex items-center justify-center border-2 border-gray-700 rounded text-gray-800 hover:cursor-default"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 1, 1] }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={quantity}
              >
                {quantity}
              </motion.div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  incrementQuantity();
                }}
                className="text-gray-800 w-8 h-8 flex items-center justify-center rounded hover:cursor-pointer"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.95 }}
              >
                <CiSquarePlus className="text-4xl" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <motion.button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 hover:cursor-pointer transition-colors"
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              Add to Cart
            </motion.button>
            <motion.button
              onClick={handleGoToCart}
              className="cart-button flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 hover:cursor-pointer transition-colors"
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.97 }}
            >
              View Cart
            </motion.button>
          </motion.div>

          <motion.div 
            className="pt-4 border-t border-gray-200"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h2 className="font-semibold mb-2">Product Details</h2>
            <div className="space-y-1">
              <p className="text-gray-600">
                Category:{" "}
                <span className="font-medium capitalize">
                  {product.category}
                </span>
              </p>
              <p className="text-gray-600">
                Rating:{" "}
                <span className="font-medium">
                  {product.rating || "N/A"}
                </span>
                {product.stock > 0 && (
                  <span className="text-gray-500 ml-2">
                    In Stock: {product.stock}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div 
        className="mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        <CategorySuggestions
          category={product.category}
          title={`More ${product.category} Products`}
          excludeProductId={product.id}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail;