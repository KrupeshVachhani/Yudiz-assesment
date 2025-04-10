import { useState } from "react";
import PropTypes from "prop-types";
// import { COLORS } from "../../../constants";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

const ProductCard = ({
  product,
  selectedColors,
  onColorSelect,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const cart = useSelector((state) => state.cart);

  const handleProductClick = () => {
    window.open(`/product/${product.id}`, "_blank");
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    setQuantity(1);

    const existingItem = cart.items.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity >= 10) {
      toast.warning(
        `You can't add more than 10 of ${product.title} to the cart!`,
        {
          position: "top-center",
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
          onClose: () => console.log("Toast closed"),
        }
      );
      return;
    }

    const maxAddable = 10 - currentQuantity;
    const finalQuantity = quantity > maxAddable ? maxAddable : quantity;

    onAddToCart(product, finalQuantity);

    toast.success(
      `Added ${
        product.title
      } with quantity of ${finalQuantity} to cart successfully!${
        finalQuantity < quantity
          ? ` (Only ${finalQuantity} added due to limit)`
          : ""
      }`,
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
        transition: Bounce,
        onClose: () => console.log("Toast closed"),
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
          src={product.image_url}
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
            {product.colors && product.colors.map((color, index) => (
              <button
                key={index}
                onClick={(e) => handleColorClick(e, color)}
                className={`w-4 h-4 bg-[${color}] border rounded-full hover:cursor-pointer ${
                  selectedColors[product.id] === color
                    ? "ring-2 ring-offset-2 ring-gray-500"
                    : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 my-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementQuantity();
              }}
              className="text-gray-800 w-8 h-8 flex items-center justify-center rounded hover:cursor-pointer"
            >
              <CiSquareMinus className="text-4xl" />
            </button>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-10 h-8 flex items-center justify-center border-2 border-gray-700 rounded text-gray-800 hover:cursor-default"
            >
              {quantity}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                incrementQuantity();
              }}
              className="text-gray-800 w-8 h-8 flex items-center justify-center rounded hover:cursor-pointer"
            >
              <CiSquarePlus className="text-4xl" />
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