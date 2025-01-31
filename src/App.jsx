import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routeing/router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer onClick={(e) => e.stopPropagation()} />
    </QueryClientProvider>
  );
}

export default App;
