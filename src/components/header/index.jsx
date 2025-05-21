import logo from "../../assets/logo.svg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { Suspense, useDeferredValue, useState } from "react";
import ProductCategories from "../body/ProductPage";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  return (
    <>
      <header className="container mx-auto px-8 h-20 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="w-1/4 flex items-center">
          <img src={logo} alt="Flipkart" className="h-12 object-contain" />
        </div>

        <div className="w-1/2 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <Link className="w-1/4 flex justify-end items-center" to="/cart">
          <MdOutlineShoppingCart className="text-[2rem] text-black" />
        </Link>
      </header>

      <Suspense fallback={<h2>Loading...</h2>}>
        <ProductCategories Search={deferredSearchTerm} />
      </Suspense>
    </>
  );
};

export default Header;
