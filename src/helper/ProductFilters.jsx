import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import PropTypes from "prop-types";

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

  const handleInputFocus = (e) => {
    e.target.value = "";
  };

  const handleInputChange = (e, type) => {
    let value = e.target.value;

    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, "");

    // Parse the value and ensure it's within bounds
    let numValue = parseInt(value || "0");
    if (numValue > MAX_PRICE) {
      numValue = MAX_PRICE;
      value = MAX_PRICE.toString();
    }

    setInputValues((prev) => ({ ...prev, [type]: value }));

    // Update the range slider and notify parent
    const newRange = {
      ...currentRange,
      [type]: numValue,
    };
    setCurrentRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleInputBlur = (e, type) => {
    let value = e.target.value;

    // If empty, reset to current range value
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

  return (
    <div className="mb-4 space-y-4 text-gray-800">
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            <span>Select Categories</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => onCategorySelect("all")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategorySelect(category)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black capitalize"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center space-x-4">
          <h3 className="font-medium whitespace-nowrap">Price Range:</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="text"
                value={inputValues.min}
                onChange={(e) => handleInputChange(e, "min")}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, "min")}
                className="w-20 pl-5 text-center px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <span className="text-gray-600">-</span>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="text"
                value={inputValues.max}
                onChange={(e) => handleInputChange(e, "max")}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, "max")}
                className="w-20 pl-5 text-center px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={MAX_PRICE.toString()}
              />
            </div>
          </div>

          <div className="relative w-48 h-2">
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
                }
                
                .range-slider::-moz-range-thumb {
                  pointer-events: all;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  border: 2px solid #3b82f6;
                  background-color: white;
                  cursor: pointer;
                }

                .range-slider::-webkit-slider-runnable-track,
                .range-slider::-moz-range-track {
                  cursor: pointer;
                }
              `}
            </style>

            <div className="absolute w-full h-1 bg-gray-200 rounded-lg top-0.5"></div>

            <div
              className="absolute h-1 bg-blue-500 rounded-lg top-0.5"
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
            ></div>

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
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {productsInRange} products
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            <span>{getSortLabel()}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isSortDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isSortDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => onSortChange("price_asc")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => onSortChange("price_desc")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => onSortChange("name_asc")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Name: A to Z
                </button>
                <button
                  onClick={() => onSortChange("name_desc")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Name: Z to A
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-full capitalize"
            >
              <span>{category}</span>
              {category !== "all" && (
                <button
                  onClick={() => onRemoveCategory(category)}
                  className="hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ProductFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCategorySelect: PropTypes.func.isRequired,
  onRemoveCategory: PropTypes.func.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
  isSortDropdownOpen: PropTypes.bool.isRequired,
  setIsSortDropdownOpen: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  onPriceRangeChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  sortBy: PropTypes.oneOf([
    "price_asc",
    "price_desc",
    "name_asc",
    "name_desc",
    "",
  ]).isRequired,
};

export default ProductFilters;
