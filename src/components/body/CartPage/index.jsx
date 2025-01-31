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
import CategorySuggestions from "../../suggestions";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uniqueCategories = [...new Set(cartItems.map((item) => item.category))];
  const cartProductIds = cartItems.map((item) => item.id);

  const handleRemoveFromCart = (e, product) => {
    e.stopPropagation();
    dispatch(removeFromCart({ ...product, quantity: product.quantity }));
    toast.success("Item removed from cart", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleDecreaseCount = (e, product) => {
    e.stopPropagation();
    if (product.quantity > 1) {
      dispatch(removeFromCart({ ...product, quantity: 1 }));
      toast.success("Item quantity decreased", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      handleRemoveFromCart(e, product);
    }
  };

  const handleIncreaseCount = (e, product) => {
    e.stopPropagation();
    if (product.quantity < 10) {
      dispatch(addToCart({ ...product, quantity: 1 }));
      toast.success("Item quantity increased", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.warning("Maximum quantity reached", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleProductClick = (product) => {
    window.open(`/product/${product.id}`, "_blank");
  };

  const handleEmptyCart = () => {
    Swal.fire({
      title: "Empty Cart?",
      text: "This will remove all items from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, empty it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCart());
        toast.success("Cart emptied successfully!", {
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
          className="flex items-center text-gray-600 hover:text-gray-400 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Your Cart
          </h1>
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <div className="flex flex-col items-center gap-4">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
              <p className="text-lg text-gray-500">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors hover:cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-400"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors hover:cursor-pointer"
          >
            Explore More
          </button>
          <button
            onClick={handleEmptyCart}
            className="flex items-center px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Empty Cart
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Your Cart
        </h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:cursor-pointer"
              onClick={() => handleProductClick(item)}
            >
              <div className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
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
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDecreaseCount(e, item)}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors hover:cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-black" />
                      </button>

                      <span className="w-8 text-center font-medium text-black">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => handleIncreaseCount(e, item)}
                        className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${
                          item.quantity >= 10
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={item.quantity >= 10}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-black hover:cursor-pointer" />
                      </button>
                    </div>

                    <div className="flex flex-col items-end space-y-1 text-gray-800">
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                      <p className="text-lg font-bold text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4 text-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Total Quantity</span>
              <span>{totalQuantity} items</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

        <CategorySuggestions
          categories={uniqueCategories}
          productIds={cartProductIds}
        />
      </div>
    </div>
  );
};

export default CartPage;
