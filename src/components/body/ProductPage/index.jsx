import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import ShimmerUIProducts from "../../../helper/ShimmerUIProducts";
import { fetchGetApi } from "../../../helper/GetApi";
import { addToCart } from "../../../redux/slices/CartSlice";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import { usePagination } from "../../../hooks/UsePagination.jsx";
import ProductFilters from "../../../helper/ProductFilters.jsx";

const ProductCategories = ({ Search }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [selectedColors, setSelectedColors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("default");

  const itemsPerPage = 8;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const responseProducts = await fetchGetApi("/products");
        const responseCategories = await fetchGetApi("/products/categories");
        
        const prices = responseProducts.map(product => product.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        
        setProducts(responseProducts);
        setCategories(responseCategories);
        setPriceRange({ min: minPrice, max: maxPrice });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleAddToCart = useCallback(
    (product, quantity) => {
      const selectedColor = selectedColors[product.id] || "default";
      dispatch(addToCart({ ...product, selectedColor, quantity }));
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

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setIsSortDropdownOpen(false);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((item) => {
      const matchesSearch = Search
        ? item.title.toLowerCase().includes(Search.toLowerCase()) ||
          item.description.toLowerCase().includes(Search.toLowerCase())
        : true;
      const matchesCategory =
        selectedCategories.includes("all") ||
        selectedCategories.includes(item.category);
      const matchesPrice =
        item.price >= priceRange.min && item.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name_asc":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "name_desc":
        return [...filtered].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return filtered;
    }
  }, [products, Search, selectedCategories, priceRange, sortBy]);

  const pagination = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage,
    currentPage,
    maxPageButtons: 5,
  });

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <ShimmerUIProducts />;

  return (
    <div className="container mx-auto px-16 mt-4">
      <ProductFilters
        categories={categories}
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        onRemoveCategory={handleRemoveCategory}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        isSortDropdownOpen={isSortDropdownOpen}
        setIsSortDropdownOpen={setIsSortDropdownOpen}
        products={products}
        onPriceRangeChange={handlePriceRangeChange}
        onSortChange={handleSortChange}
        sortBy={sortBy}
      />

      <div className="mb-4 text-gray-600">
        Showing {currentProducts.length} of {filteredProducts.length} products
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your criteria
        </div>
      )}

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