import React from "react";

function UserPagination() {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="w-64 h-10 flex justify-center items-center space-x-4">
      {/* Previous button */}
      <div className="w-20 py-2 rounded-lg flex justify-center items-center gap-2">
        <div className="w-3.5 h-3.5 relative origin-top-left -rotate-180" />
        <div className="text-neutral-800 text-xs font-bold uppercase">
          Previous
        </div>
      </div>

      {/* Page number buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-[39px] h-10 px-4 py-2.5  rounded-lg justify-center items-center gap-2 inline-flex text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px] 
                    ${
                      currentPage === page ? "bg-emerald-600" : "bg-violet-800"
                    }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <div className="w-20 py-2 rounded-lg flex justify-center items-center gap-2">
        <div className="text-neutral-800 text-xs font-bold uppercase">Next</div>
        <div className="w-3.5 h-3.5 relative" />
      </div>
    </div>
  );
}

export default UserPagination;
