import logo from "../../assets/logo.svg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import ProductCategories from "../body/ProductPage";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import productData from "../../Data.json";
import SearchPreview from "../body/SearchPreview";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState(productData);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerControls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 80);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    headerControls.start({
      y: isHeaderVisible ? 0 : -100,
      opacity: isHeaderVisible ? 1 : 0,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    });
  }, [isHeaderVisible]);

  const shimmerVariants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: "200% 50%",
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 10,
        ease: "linear",
      },
    },
  };

  return (
    <>
      <motion.header
        className="container mx-auto px-8 h-16 rounded-2xl flex items-center justify-between sticky top-4 z-50"
        initial="initial"
        animate={headerControls}
        variants={shimmerVariants}
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
          backgroundSize: "400% 400%",
          backdropFilter: "blur(14px) saturate(180%)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Logo */}
        <motion.div
          className="w-1/4 flex items-center relative"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <motion.img
              src={logo}
              alt="Logo"
              className="h-12 object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 -z-10 blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 60%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="w-1/2 flex justify-center relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="relative w-full max-w-xl"
            animate={{ scale: isSearchFocused ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="relative"
              animate={{
                boxShadow: isSearchFocused
                  ? "0 8px 25px rgba(0,0,0,0.15)"
                  : "0 4px 12px rgba(0,0,0,0.05)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search for products..."
                className="w-full text-black px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  transition: "all 0.3s ease",
                }}
              />
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      boxShadow: "0 0 0 2px rgba(59,130,246,0.4)",
                      zIndex: -1,
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Live Preview */}
            <AnimatePresence>
              {searchTerm.trim() && (
                <motion.div
                  className="absolute top-[110%] left-0 w-full z-40"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <SearchPreview products={products} query={searchTerm} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Cart */}
        <motion.div
          className="w-1/4 flex justify-end items-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/cart">
            <motion.div
              className="relative p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full -z-10 opacity-0"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.9, 1.3, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
                }}
              />
              <MdOutlineShoppingCart className="text-[2rem] text-black" />
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                2
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.header>

      {/* Products Section */}
      <Suspense
        fallback={
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <p className="mt-4 text-gray-600 font-medium">
              Loading premium products...
            </p>
          </motion.div>
        }
      >
        <ProductCategories />
      </Suspense>
    </>
  );
};

export default Header;
