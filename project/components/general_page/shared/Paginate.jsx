import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Paginate({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex my-4">
      <div className="mx-auto flex items-center gap-2">
        <button
          className="px-2 py-2 rounded"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${
              i + 1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-2 py-2 rounded"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-500 rotate-180" />
        </button>
      </div>
    </div>
  );
}
