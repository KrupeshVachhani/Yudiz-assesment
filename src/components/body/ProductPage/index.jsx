import { useState, useEffect, useCallback, useMemo } from "react";
import ShimmerUIProducts from "../../../helper/ShimmerUIProducts";
import { useDispatch } from "react-redux";
import { fetchGetApi } from "../../../helper/GetApi";
import { addToCart } from "../../../redux/slices/CartSlice";
import PropTypes from "prop-types";
import { ChevronDown, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { usePagination } from "../../../hooks/UsePagination.js";

const ProductCategories = ({ Search }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [selectedColors, setSelectedColors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 8;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const responseProducts = await fetchGetApi("/products");
        const responseCategories = await fetchGetApi("/products/categories");
        setProducts(responseProducts);
        setCategories(responseCategories);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      const selectedColor = selectedColors[product.id] || "default";
      dispatch(addToCart({ ...product, selectedColor }));
    },
    [dispatch, selectedColors]
  );

  const handleColorSelect = useCallback((productId, colorName) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: colorName,
    }));
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategories((prev) => {
      if (category === "all") return ["all"];
      const newCategories = prev.filter((cat) => cat !== "all");
      if (newCategories.includes(category)) {
        const result = newCategories.filter((cat) => cat !== category);
        return result.length === 0 ? ["all"] : result;
      }
      return [...newCategories, category];
    });
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.filter(
        (category) => category !== categoryToRemove
      );
      return newCategories.length === 0 ? ["all"] : newCategories;
    });
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = Search
        ? item.title.toLowerCase().includes(Search.toLowerCase()) ||
          item.description.toLowerCase().includes(Search.toLowerCase())
        : true;

      const matchesCategory =
        selectedCategories.includes("all") ||
        selectedCategories.includes(item.category);

      return matchesSearch && matchesCategory;
    });
  }, [products, Search, selectedCategories]);

  const pagination = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage,
    currentPage,
    maxPageButtons: 5
  });

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <ShimmerUIProducts />;

  return (
    <div className="container mx-auto px-16 mt-4">
      <div className="mb-4">
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
                  onClick={() => handleCategorySelect("all")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black capitalize"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-full capitalize"
            >
              <span>{category}</span>
              {category !== "all" && (
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedColors={selectedColors}
            onColorSelect={handleColorSelect}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.canPreviousPage}
            className={`px-4 py-2 rounded ${
              !pagination.canPreviousPage
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white"
            }`}
          >
            Previous
          </button>

          {pagination.pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded ${
                currentPage === pageNumber
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.canNextPage}
            className={`px-4 py-2 rounded ${
              !pagination.canNextPage
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

ProductCategories.propTypes = {
  Search: PropTypes.string,
};

export default ProductCategories;