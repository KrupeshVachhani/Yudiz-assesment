import { createBrowserRouter } from "react-router-dom";
import Header from "../components/header";
import Cart from "../components/body/CartPage";
import ProductDetail from "../components/body/ProductPage/ProductDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
]);
