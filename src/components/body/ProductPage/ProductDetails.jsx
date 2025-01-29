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
      dispatch(addToCart({ ...product, selectedColor }));
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
    }
  };

  const handleGoToCart = ()=>{
    navigate("/cart");
  }

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-200 hover:text-gray-400 hover:cursor-pointer mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center bg-white rounded-lg p-4">
          <img
            src={product.image}
            alt={product.title}
            className="max-w-full h-auto max-h-[500px] object-contain"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-4 text-gray-600">
            {product.title}
          </h1>
          <p className="text-3xl font-bold text-green-600 mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Color</h3>
            <div className="flex gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 ${
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <div className="border-t pt-4">
              <p className="text-gray-600 capitalize">
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Rating:</span>{" "}
                {product.rating?.rate || "N/A"} ({product.rating?.count || 0}{" "}
                reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
