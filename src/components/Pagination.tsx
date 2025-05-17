import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Show up to 5 page numbers, with ... if needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="border border-[#6C757D] text-[#6C757D] rounded-lg px-4 py-2 font-semibold font-['Figtree'] hover:bg-[#e6f4f1] transition disabled:opacity-50"
      >
        Trước
      </button>
      {getPageNumbers().map((page, idx) =>
        typeof page === 'number' ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg font-semibold font-['Figtree'] transition ${
              page === currentPage
                ? 'bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white shadow'
                : 'border border-[#6C757D] text-[#6C757D] hover:bg-[#e6f4f1]'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-2 py-2 text-[#6C757D]">...</span>
        )
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="border border-[#6C757D] text-[#6C757D] rounded-lg px-4 py-2 font-semibold font-['Figtree'] hover:bg-[#e6f4f1] transition disabled:opacity-50"
      >
        Tiếp
      </button>
    </div>
  );
} 