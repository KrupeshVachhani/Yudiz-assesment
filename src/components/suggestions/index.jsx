import { useQueries } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { categoryProductsOptions } from "../../helper/categoryQueries.js";

const ProductShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
});

//product card
const ProductCard = ({ product, formatPrice }) => (
  <div className="flex-none w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="p-4 flex flex-col h-full">
      <div className="w-full h-48 mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <h4 className="text-gray-900 font-medium mb-2 line-clamp-2 flex-grow">
        {product.title}
      </h4>
      <div className="mt-2">
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => window.open(`/product/${product.id}`, "_blank")}
          >
            View
          </button>
        </div>
      </div>
    </div>
  </div>
);

ProductCard.propTypes = {
  product: ProductShape.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

const CategorySuggestions = ({
  category,
  categories,
  title,
  excludeProductId,
}) => {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const categoriesToQuery = categories || (category ? [category] : []);

  const queries = useQueries({
    queries:
      categoriesToQuery.length > 0
        ? categoriesToQuery
            .map((cat) => categoryProductsOptions(cat))
            .filter(Boolean)
        : [{ queryKey: [], queryFn: () => [] }],
  });

  const scroll = (categoryId, direction) => {
    const container = document.getElementById(`scroll-container-${categoryId}`);
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const formatPrice = (price) =>
    typeof price !== "number" ? "$0.00" : `$${price.toFixed(2)}`;

  return (
    <div className="container w-full py-6">
      {categoriesToQuery.map((currentCategory, index) => {
        const { data: products = [], isLoading, error } = queries[index] || {};

        if (isLoading) {
          return (
            <div
              key={`loading-${currentCategory}`}
              className="p-4 text-gray-500"
            >
              Loading suggestions...
            </div>
          );
        }
        if (error || !products.length) return null;

        const suggestedProducts = products.filter(
          (product) =>
            product &&
            product.id !== excludeProductId &&
            !cartItems.some((cartItem) => cartItem?.id === product.id)
        );

        if (!suggestedProducts.length) return null;

        const categoryTitle =
          title ||
          (categories
            ? "Similar Products"
            : `More ${currentCategory} Products`);

        return (
          <div key={`category-${currentCategory}`} className="w-full py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                {categoryTitle}
              </h3>
            </div>
            <div className="relative group">
              <button
                onClick={() => scroll(currentCategory, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div
                id={`scroll-container-${currentCategory}`}
                className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {suggestedProducts.map((product) => (
                  <ProductCard
                    key={`product-${product.id}`}
                    product={product}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
              <button
                onClick={() => scroll(currentCategory, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

CategorySuggestions.propTypes = {
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  excludeProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CategorySuggestions;
