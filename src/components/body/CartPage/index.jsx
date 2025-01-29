import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../redux/slices/CartSlice";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleIncreaseCount = (product) => {
    dispatch(addToCart(product));
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
          Back to Products
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
   <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-400 hover:cursor-pointer mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500 capitalize">
                      {item.category}
                    </p>
                    {item.selectedColor && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">•</span>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: item.selectedColor }}
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

                  <div className="flex items-center mt-3 gap-2">
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors border border-black hover:cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5 text-black" />
                    </button>

                    <span className="w-8 text-center font-medium text-black">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncreaseCount(item)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors border border-black hover:cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>

                <div className="text-right space-y-1">
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
