import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import ShimmerUIProducts from "../../../helper/ShimmerUIProducts";
import { addToCart } from "../../../redux/slices/CartSlice";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import { usePagination } from "../../../hooks/UsePagination.jsx";
import ProductFilters from "../../../helper/ProductFilters.jsx";
import productData from "../../../Data.json";
import HeroBanner from "./HeroBanner";
import OfferBanners from "./OfferBanners";
import { motion } from "framer-motion";

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
    try {
      setProducts(productData);
      const uniqueCategories = [...new Set(productData.map(product => product.category))];
      setCategories(uniqueCategories);

      if (productData.length > 0) {
        const prices = productData.map(product => product.price);
        setPriceRange({ min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading product data:", error);
      setLoading(false);
    }
  }, []);

  const handleAddToCart = useCallback(
    (product, quantity) => {
      const selectedColor = selectedColors[product.id] || (product.colors?.[0] ?? null);
      dispatch(addToCart({ ...product, selectedColor, quantity }));
    },
    [dispatch, selectedColors]
  );

  const handleColorSelect = useCallback((productId, colorName) => {
    setSelectedColors(prev => ({ ...prev, [productId]: colorName }));
  }, []);

  const handleCategorySelect = category => {
    setSelectedCategories(prev => {
      if (category === "all") return ["all"];
      const filtered = prev.filter(cat => cat !== "all");
      if (filtered.includes(category)) {
        const result = filtered.filter(cat => cat !== category);
        return result.length === 0 ? ["all"] : result;
      }
      return [...filtered, category];
    });
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const handleRemoveCategory = categoryToRemove => {
    setSelectedCategories(prev => {
      const result = prev.filter(cat => cat !== categoryToRemove);
      return result.length === 0 ? ["all"] : result;
    });
    setCurrentPage(1);
  };

  const handlePriceRangeChange = newRange => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const handleSortChange = sortType => {
    setSortBy(sortType);
    setIsSortDropdownOpen(false);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(item => {
      const matchesSearch = Search ? item.title.toLowerCase().includes(Search.toLowerCase()) || (item.description?.toLowerCase().includes(Search.toLowerCase())) : true;
      const matchesCategory = selectedCategories.includes("all") || selectedCategories.includes(item.category);
      const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "price_asc": return [...filtered].sort((a, b) => a.price - b.price);
      case "price_desc": return [...filtered].sort((a, b) => b.price - a.price);
      case "name_asc": return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "name_desc": return [...filtered].sort((a, b) => b.title.localeCompare(a.title));
      default: return filtered;
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

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <ShimmerUIProducts />;

  return (
    <motion.div
      className="container mx-auto px-4 lg:px-16 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <HeroBanner />
      <OfferBanners />

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
        priceRange={priceRange}
      />

      <motion.div
        className="mb-4 text-gray-600"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Showing {currentProducts.length} of {filteredProducts.length} products
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {currentProducts.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard
              product={product}
              selectedColors={selectedColors}
              onColorSelect={handleColorSelect}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        ))}
      </motion.div>

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
            className={`px-4 py-2 rounded ${!pagination.canPreviousPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white"}`}
          >
            Previous
          </button>
          {pagination.pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded ${currentPage === pageNumber ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white"}`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.canNextPage}
            className={`px-4 py-2 rounded ${!pagination.canNextPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white"}`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

ProductCategories.propTypes = {
  Search: PropTypes.string,
};

export default ProductCategories;
