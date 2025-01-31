import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  removeFromCart,
} from "../../../redux/slices/CartSlice";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../constants";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (e, product) => {
    e.stopPropagation();
    dispatch(removeFromCart(product));
  };

  const handleIncreaseCount = (e, product) => {
    e.stopPropagation();
    if (product.quantity < 10) {
      const productToAdd = {
        ...product,
        quantity: 1,
      };
      dispatch(addToCart(productToAdd));
    }
  };

  const handleProductClick = (product) => {
    window.open(`/product/${product.id}`, "_blank");
  };

  const handleEmptyCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will empty your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, empty it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCart());
        toast.success("Your cart has been emptied!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    });
  };
  const getColorClass = (colorName) => {
    const color = COLORS.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    );
    return color ? color.code : "bg-gray-400";
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-200 hover:text-gray-400 hover:cursor-pointer mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-center mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <div className="flex flex-col items-center gap-4">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
            <p className="text-lg text-gray-500">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-400 hover:cursor-pointer mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <button
          onClick={() => handleEmptyCart()}
          className="text-black hover:cursor-pointer mb-6 border-2 border-black p-1 rounded-lg"
        >
          <p>Empty Your Cart</p>
        </button>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Your Cart
        </h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
              onClick={() => handleProductClick(item)}
            >
              <div className="p-4">
                <div className="flex flex-col space-y-4">
                  {/* Top section with image and details */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 capitalize">
                          {item.category}
                        </p>
                        {item.selectedColor && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">•</span>
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-4 h-4 rounded-full ${getColorClass(
                                  item.selectedColor
                                )}`}
                              />
                              <span className="text-sm text-gray-500 capitalize">
                                {item.selectedColor}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 overflow-hidden">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section with controls and price */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleRemoveFromCart(e, item)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors border border-black hover:cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-5 h-5 text-black" />
                      </button>

                      <span className="w-8 text-center font-medium text-black">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => handleIncreaseCount(e, item)}
                        className={`p-1 hover:bg-gray-100 rounded-md transition-colors border border-black hover:cursor-pointer ${
                          item.quantity >= 10
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={item.quantity >= 10}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-5 h-5 text-black" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center sm:items-end space-y-1">
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-black">Total Items:</span>
              <span className="font-medium text-black">{totalQuantity}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-black">Total Amount:</span>
              <span className="font-bold text-black">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
