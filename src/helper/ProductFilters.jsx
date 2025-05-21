/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { ChevronDown, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductFilters = ({
  categories,
  selectedCategories,
  onCategorySelect,
  onRemoveCategory,
  isDropdownOpen,
  setIsDropdownOpen,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  products,
  onPriceRangeChange,
  onSortChange,
  sortBy,
}) => {
  const MAX_PRICE = 1000;
  const [priceRange, setPriceRange] = useState({ min: 0, max: MAX_PRICE });
  const [currentRange, setCurrentRange] = useState({ min: 0, max: MAX_PRICE });
  const [inputValues, setInputValues] = useState({
    min: "0",
    max: MAX_PRICE.toString(),
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products.map((product) => product.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.min(Math.ceil(Math.max(...prices)), MAX_PRICE);
      setPriceRange({ min: minPrice, max: maxPrice });
      setCurrentRange({ min: minPrice, max: maxPrice });
      setInputValues({ min: minPrice.toString(), max: maxPrice.toString() });
    }
  }, [products]);

  const productsInRange =
    products?.filter(
      (product) =>
        product.price >= currentRange.min && product.price <= currentRange.max
    )?.length || 0;

  const handleInputFocus = (e) => (e.target.value = "");

  const handleInputChange = (e, type) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    let numValue = parseInt(value || "0");
    if (numValue > MAX_PRICE) {
      numValue = MAX_PRICE;
      value = MAX_PRICE.toString();
    }
    setInputValues((prev) => ({ ...prev, [type]: value }));
    const newRange = { ...currentRange, [type]: numValue };
    setCurrentRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleInputBlur = (e, type) => {
    let value = e.target.value;
    if (!value) {
      value = currentRange[type].toString();
      setInputValues((prev) => ({ ...prev, [type]: value }));
    }
  };

  const handleRangeChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    const newRange = { ...currentRange };
    if (type === "min") {
      newRange.min = Math.max(
        priceRange.min,
        Math.min(value, currentRange.max - 1)
      );
    } else {
      newRange.max = Math.min(Math.max(currentRange.min + 1, value), MAX_PRICE);
    }
    setCurrentRange(newRange);
    setInputValues({
      min: newRange.min.toString(),
      max: newRange.max.toString(),
    });
    onPriceRangeChange(newRange);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "price_asc":
        return "Price: Low to High";
      case "price_desc":
        return "Price: High to Low";
      case "name_asc":
        return "Name: A to Z";
      case "name_desc":
        return "Name: Z to A";
      default:
        return "Sort By";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  const tagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 15 },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 },
    },
    hover: { scale: 1.05 },
  };

  return (
    <motion.div
      className="mb-4 space-y-4 text-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mobile Filter Button */}
      <motion.div className="md:hidden" variants={itemVariants}>
        <motion.button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
        </motion.button>
      </motion.div>

      {/* Desktop and Mobile Filters */}
      <AnimatePresence>
        {(isMobileFiltersOpen || window.innerWidth >= 768) && (
          <motion.div
            className={`${isMobileFiltersOpen ? "block" : "hidden"} md:block`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-4"
              variants={containerVariants}
            >
              {/* Category Dropdown */}
              <motion.div
                className="relative w-full md:w-auto"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full md:w-auto flex items-center justify-between md:justify-start space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Select Categories</span>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute z-10 mt-2 w-full md:w-64 bg-white rounded-md shadow-lg overflow-hidden"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="py-1">
                        <motion.button
                          onClick={() => onCategorySelect("all")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black hover:text-gray-700 hover:cursor-pointer"
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          whileTap={{ backgroundColor: "#e5e7eb" }}
                        >
                          All Categories
                        </motion.button>

                        {categories.map((category) => (
                          <motion.button
                            key={category}
                            onClick={() => onCategorySelect(category)}
                            className={`w-full text-left px-4 py-2 z-50 hover:bg-gray-100 hover:text-gray-700 hover:cursor-pointer text-black capitalize ${
                              selectedCategories.includes(category)
                                ? "bg-gray-500 text-white"
                                : ""
                            }`}
                            whileHover={
                              !selectedCategories.includes(category)
                                ? { backgroundColor: "#f3f4f6" }
                                : {}
                            }
                            whileTap={{ scale: 0.98 }}
                          >
                            {category}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Price Range Filter */}
              <motion.div
                className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"
                variants={itemVariants}
              >
                <h3 className="font-medium">Price Range:</h3>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <motion.input
                      type="text"
                      value={inputValues.min}
                      onChange={(e) => handleInputChange(e, "min")}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "min")}
                      className="w-full md:w-20 pl-5 text-center px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      whileFocus={{
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                      }}
                    />
                  </div>
                  <span className="text-gray-600">-</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <motion.input
                      type="text"
                      value={inputValues.max}
                      onChange={(e) => handleInputChange(e, "max")}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "max")}
                      className="w-full md:w-20 pl-5 text-center px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={MAX_PRICE.toString()}
                      whileFocus={{
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                      }}
                    />
                  </div>
                </div>

                <div className="relative w-full md:w-48 h-2">
                  <style>
                    {`
                      .range-slider::-webkit-slider-thumb {
                        pointer-events: all;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 2px solid #3b82f6;
                        background-color: white;
                        cursor: pointer;
                        -webkit-appearance: none;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        transition: all 0.2s ease;
                      }
                      
                      .range-slider::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                      }
                      
                      .range-slider::-moz-range-thumb {
                        pointer-events: all;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 2px solid #3b82f6;
                        background-color: white;
                        cursor: pointer;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        transition: all 0.2s ease;
                      }
                      
                      .range-slider::-moz-range-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                      }

                      .range-slider::-webkit-slider-runnable-track,
                      .range-slider::-moz-range-track {
                        cursor: pointer;
                      }
                      
                      .price-track-animation {
                        transition: left 0.3s ease, right 0.3s ease;
                      }
                    `}
                  </style>

                  <div className="absolute w-full h-1 bg-gray-200 rounded-lg top-0.5"></div>
                  <motion.div
                    className="absolute h-1 bg-blue-500 rounded-lg top-0.5 price-track-animation"
                    style={{
                      left: `${
                        ((currentRange.min - priceRange.min) /
                          (priceRange.max - priceRange.min)) *
                        100
                      }%`,
                      right: `${
                        100 -
                        ((currentRange.max - priceRange.min) /
                          (priceRange.max - priceRange.min)) *
                          100
                      }%`,
                    }}
                    animate={{
                      left: `${
                        ((currentRange.min - priceRange.min) /
                          (priceRange.max - priceRange.min)) *
                        100
                      }%`,
                      right: `${
                        100 -
                        ((currentRange.max - priceRange.min) /
                          (priceRange.max - priceRange.min)) *
                          100
                      }%`,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  ></motion.div>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={currentRange.min}
                    onChange={(e) => handleRangeChange(e, "min")}
                    className="range-slider absolute w-full h-1 top-0.5 bg-transparent appearance-none pointer-events-none"
                    style={{ zIndex: 3 }}
                  />
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={currentRange.max}
                    onChange={(e) => handleRangeChange(e, "max")}
                    className="range-slider absolute w-full h-1 top-0.5 bg-transparent appearance-none pointer-events-none"
                    style={{ zIndex: 4 }}
                  />
                </div>
                <motion.span
                  className="text-sm text-gray-600 whitespace-nowrap"
                  key={productsInRange}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {productsInRange} products
                </motion.span>
              </motion.div>

              {/* Sort Dropdown */}
              <motion.div
                className="relative w-full md:w-auto"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full md:w-auto flex items-center justify-between md:justify-start space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{getSortLabel()}</span>
                  <motion.div
                    animate={{ rotate: isSortDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isSortDropdownOpen && (
                    <motion.div
                      className="absolute right-0 z-10 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg overflow-hidden"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="py-1">
                        {[
                          "price_asc",
                          "price_desc",
                          "name_asc",
                          "name_desc",
                        ].map((option) => {
                          const labels = {
                            price_asc: "Price: Low to High",
                            price_desc: "Price: High to Low",
                            name_asc: "Name: A to Z",
                            name_desc: "Name: Z to A",
                          };

                          return (
                            <motion.button
                              key={option}
                              onClick={() => onSortChange(option)}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-black ${
                                sortBy === option
                                  ? "bg-gray-100 font-medium"
                                  : ""
                              }`}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              whileTap={{ backgroundColor: "#e5e7eb" }}
                            >
                              {labels[option]}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Categories */}
      <AnimatePresence>
        {selectedCategories.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {selectedCategories.map((category) => (
              <motion.div
                key={category}
                className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-full capitalize"
                variants={tagVariants}
                whileHover="hover"
                layout
              >
                <span>{category}</span>
                {category !== "all" && (
                  <motion.button
                    onClick={() => onRemoveCategory(category)}
                    className="hover:text-gray-200"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductFilters;
