import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { Item } from "../types/Item";

type ItemListProps = {
  items: Item[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onFilterChange: (searchTerm: string) => void;
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" }
];

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  onEditItem, 
  onDeleteItem, 
  onFilterChange 
}) => {
  const [filter, setFilter] = useState({
    searchTerm: "",
  });

  // Trigger filter change when filter state updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filter.searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filter.searchTerm, onFilterChange]);

  // Clear all filters
  const clearFilters = () => {
    setFilter({
      searchTerm: "",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Safe status formatting
  const formatStatus = (status: string | undefined): string => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div>
      {/* Filtering Section */}
      <div className="mb-4 flex space-x-2">
        {/* Search Input */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search items..." 
            value={filter.searchTerm}
            onChange={(e) => setFilter(prev => ({
              ...prev, 
              searchTerm: e.target.value
            }))}
            className="w-full p-2 border rounded-md pl-8"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute left-2 top-3 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Status Dropdown */}
        <select 
          value={filter.searchTerm}
          onChange={(e) => setFilter(prev => ({
            ...prev, 
            searchTerm: e.target.value
          }))}
          className="p-2 border rounded-md"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {(filter.searchTerm) && (
          <button 
            onClick={clearFilters}
            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center"
          >
            <FaTimes className="mr-2" /> Clear Filters
          </button>
        )}
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-gray-100 text-black sticky top-0 z-10">
              <th className="p-3">Service No</th>
              <th className="p-3">Item</th>
              <th className="p-3">Status</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="p-3 font-medium">{item.service_no || 'N/A'}</td>
                <td className="p-3">{item.name || 'Unnamed Item'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {formatStatus(item.status)}
                  </span>
                </td>
                <td className="p-3">{item.price || 'N/A'}</td>
                <td className="p-3 flex space-x-2">
                  <button 
                    onClick={() => onEditItem(item)} 
                    className="text-blue-500 hover:text-blue-700 p-1"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => onDeleteItem(item.id)} 
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No items found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;