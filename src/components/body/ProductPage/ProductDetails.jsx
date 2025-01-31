import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchGetApi } from "../../../helper/GetApi";
import { addToCart } from "../../../redux/slices/CartSlice";
import { COLORS } from "../../../constants";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategorySuggestions from "../../suggestions";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState("default");
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchGetApi(`/products/${id}`),
  });

  const handleAddToCart = (e) => {
    if (product) {
      dispatch(addToCart({ ...product, selectedColor, quantity }));
      setQuantity(1);
      e.stopPropagation();
      toast.success(
        `Added ${product.title} with quantity of ${quantity} to cart successfully!`,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading)
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="text-red-500 mb-4">Failed to load product details</div>
        <button
          onClick={() => navigate('/')}
          className="text-gray-200 hover:underline"
        >
          Go To Main Page
        </button>
      </div>
    );

  if (!product) return null;

  return (
    <div className="container mx-auto p-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center bg-white rounded-lg p-4">
          <img
            src={product.image}
            alt={product.title}
            className="max-w-full h-auto max-h-[500px] object-contain"
          />
        </div>

        <div className="space-y-6 text-gray-800">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold">${product.price}</p>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <h2 className="font-semibold">Select Color</h2>
            <div className="flex space-x-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 ${
                    color.code
                  } border rounded-full transition-all ${
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2 ring-gray-500"
                      : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"
                  }`}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Quantity</h2>
            <div className="flex items-center gap-1 my-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decrementQuantity();
                }}
                className="text-gray-800 w-8 h-8 flex items-center justify-center roundedhover:cursor-pointer"
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

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 hover:cursor-pointer transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleGoToCart}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 hover:cursor-pointer transition-colors"
            >
              View Cart
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="font-semibold mb-2">Product Details</h2>
            <div className="space-y-1">
              <p className="text-gray-600">
                Category:{" "}
                <span className="font-medium capitalize">
                  {product.category}
                </span>
              </p>
              <p className="text-gray-600">
                Rating:{" "}
                <span className="font-medium">
                  {product.rating?.rate || "N/A"}
                </span>
                {product.rating?.count > 0 && (
                  <span className="text-gray-500">
                    {" "}
                    ({product.rating.count} reviews)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <CategorySuggestions
          category={product.category}
          title={`More ${product.category} Products`}
          excludeProductId={product.id}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
