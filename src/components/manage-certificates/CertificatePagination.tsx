
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CertificatePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CertificatePagination: React.FC<CertificatePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "secondary" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={
            currentPage === page
              ? "bg-white/20 text-white border-white/50 hover:bg-white/30 transition-all duration-200"
              : "border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-200"
          }
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
