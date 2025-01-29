import { useMemo } from 'react';

export const usePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  maxPageButtons = 5
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  }, [totalPages, currentPage, maxPageButtons]);

  return {
    pageNumbers,
    totalPages,
    canPreviousPage: currentPage > 1,
    canNextPage: currentPage < totalPages
  };
};