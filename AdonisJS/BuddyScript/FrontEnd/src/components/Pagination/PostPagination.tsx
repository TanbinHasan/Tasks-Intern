// components/Pagination/PostPagination.tsx
import React from 'react';

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PostPagination: React.FC<PostPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Don't render pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Add dots if current page is > 3
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add dots before last page if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0',
      gap: '8px'
    }}>
      {/* Previous button */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 16px',
          background: currentPage === 1 ? '#f0f2f5' : '#e4e6eb',
          color: currentPage === 1 ? '#BCC0C4' : '#050505',
          border: 'none',
          borderRadius: '4px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        Previous
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            style={{
              padding: '8px 14px',
              background: currentPage === page ? '#1877f2' : '#e4e6eb',
              color: currentPage === page ? 'white' : '#050505',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {page}
          </button>
        ) : (
          <span key={index} style={{ padding: '0 5px' }}>...</span>
        )
      ))}
      
      {/* Next button */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 16px',
          background: currentPage === totalPages ? '#f0f2f5' : '#e4e6eb',
          color: currentPage === totalPages ? '#BCC0C4' : '#050505',
          border: 'none',
          borderRadius: '4px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        Next
      </button>
    </div>
  );
};

export default PostPagination;