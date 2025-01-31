import { queryOptions } from '@tanstack/react-query';
import { fetchGetApi } from "./GetApi.jsx";

export const categoryProductsOptions = (category) => {
  return queryOptions({
    queryKey: ['products', category],
    queryFn: () => fetchGetApi("/products").then(
      (allProducts) => allProducts.filter((product) => product.category === category)
    ),
    staleTime: 5 * 60 * 1000,
  });
};