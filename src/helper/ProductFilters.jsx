/* eslint-disable react/prop-types */
// import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const ProductFilters = ({
  categories,
  selectedCategories,
  onCategorySelect,
  onRemoveCategory,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  return (
    <div className="mb-4">
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

      {/* Selected Categories */}
      <div className="flex flex-wrap gap-2 mt-4">
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
    </div>
  );
};

export default ProductFilters;