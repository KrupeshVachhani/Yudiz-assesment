import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchGetApi } from "../../../helper/GetApi";
import { addToCart } from "../../../redux/slices/CartSlice";
import { ChevronLeft } from "lucide-react";
import { COLORS } from "../../../constants";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("default");
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetchGetApi(`/products/${id}`);
        setProduct(response);
        setLoading(false);
      } catch {
        setError("Failed to load product details");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, selectedColor, quantity }));
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

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        {error}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-gray-100 hover:underline"
        >
          Go Back
        </button>
      </div>
    );

  if (!product) return null;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-200 hover:text-gray-400 hover:cursor-pointer mb-6"
      >
        <ChevronLeft />
        Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-center items-center bg-white rounded-lg p-4">
          <img
            src={product.image}
            alt={product.title}
            className="max-w-full h-auto max-h-[500px] object-contain"
          />
        </div>
        <div className="space-y-4 text-gray-800">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-xl">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <div>
            <h2 className="font-semibold">Select Color</h2>
            <div className="flex space-x-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.name);
                  }}
                  className={`w-4 h-4 ${
                    color.code
                  } border rounded-full hover:cursor-pointer ${
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2 ring-gray-500"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementQuantity();
              }}
              className="text-gray-800 w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 hover:cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-10 p-1 border border-gray-300 rounded text-center text-gray-800 hover:cursor-default"
            />
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

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 hover:cursor-pointer w-full md:w-auto"
            >
              Add to Cart
            </button>
            <button
              onClick={handleGoToCart}
              className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 hover:cursor-pointer w-full md:w-auto"
            >
              Go to Cart
            </button>
          </div>
          <div className="mt-4 text-gray-800">
            <h2 className="font-semibold">Product Details</h2>
            <p>Category: {product.category}</p>
            <p>
              Rating: {product.rating?.rate || "N/A"} (
              {product.rating?.count || 0} reviews)
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
