import PropTypes from "prop-types";
import { COLORS } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({
  product,
  selectedColors,
  onColorSelect,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    toast.success("Added to cart successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleColorClick = (e, colorName) => {
    e.stopPropagation();
    onColorSelect(product.id, colorName);
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
        <h3 className="text-sm font-semibold truncate mb-2 w-44">
          {product.title}
        </h3>
        <p className="text-green-600 font-bold">${product.price}</p>
        <p className="text-xs text-gray-500 capitalize mb-2">
          {product.category}
        </p>
        <div className="w-20 flex gap-3">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={(e) => handleColorClick(e, color.name)}
              className={`w-4 h-4 ${color.code} border rounded-full hover:cursor-pointer ${
                selectedColors[product.id] === color.name
                  ? "ring-2 ring-offset-2 ring-gray-500"
                  : ""
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleAddToCartClick}
          className="w-full mt-2 bg-gray-100 border border-black text-black py-2 rounded hover:bg-gray-400 hover:cursor-pointer transition-colors"
        >
          Add to Cart
        </button>
      </div>
      <ToastContainer />
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