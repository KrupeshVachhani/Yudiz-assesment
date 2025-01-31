import { useState } from "react";
import PropTypes from "prop-types";
import { COLORS } from "../../../constants";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({
  product,
  selectedColors,
  onColorSelect,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleProductClick = () => {
    window.open(`/product/${product.id}`, '_blank');
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1);
    toast.success(
      `Added ${product.title} with quantity of ${quantity} to cart successfully!`,
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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

  return (
    <div
      className="border rounded-lg p-4 border-black hover:shadow-md transition-shadow flex flex-col cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="flex justify-center items-center mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-64 h-48 object-contain rounded-xl"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-start">
        <h3 className="text-sm font-semibold truncate mb-2 w-44 text-gray-700">
          {product.title}
        </h3>
        <p className="text-green-600 font-bold">${product.price}</p>
        <p className="text-xs text-gray-500 capitalize mb-2">
          {product.category}
        </p>
        <div className="flex items-center gap-4">
          <div className="w-20 flex gap-3">
            {COLORS.map((color) => (
              <button
                key={color.id}
                onClick={(e) => handleColorClick(e, color.name)}
                className={`w-4 h-4 ${
                  color.code
                } border rounded-full hover:cursor-pointer ${
                  selectedColors[product.id] === color.name
                    ? "ring-2 ring-offset-2 ring-gray-500"
                    : ""
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementQuantity();
              }}
              className="text-gray-800 w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 hover:cursor-pointer"
            >
              -
            </button>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-10 p-1 border border-gray-300 rounded text-center text-gray-800 hover:cursor-default"
            >
              {quantity}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                incrementQuantity();
              }}
              className="text-gray-800 w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 hover:cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
        <button
          onClick={handleAddToCartClick}
          className="w-full mt-2 bg-gray-100 border border-black text-black py-2 rounded hover:bg-gray-400 hover:cursor-pointer transition-colors"
        >
          Add to Cart
        </button>
      </div>
      <ToastContainer onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  selectedColors: PropTypes.object.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
