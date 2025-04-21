import { useState, useEffect, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import ItemList from "../../components/ItemList";
import ItemForm from "../../components/ItemForm";
import { Item } from "../../types/Item";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ItemManagement = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("");

  // Fetch items with optional filtering
  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.post(`${API_URL}/admin/items`, {
        page: 1,
        limit: 10,
        keyword: filter
      });
      
      // Ensure all items have a status
      const processedItems = response.data.data.map((item: Item) => ({
        ...item,
        status: item.status || 'pending' // Default to 'pending' if status is missing
      }));
      
      console.log("Fetched Items:", processedItems);
      setItems(processedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle saving an item (Add/Update)
  const handleSaveItem = async (item: Item) => {
    try {
      let result: AxiosResponse<Item, any>;
      if (editingItem) {
        // Update existing item
        result = await axios.put(`${API_URL}/admin/items/update/${item.id}`, {
          ...item,
          status: item.status || 'pending' // Ensure status is set
        });
      } else {
        // Add new item
        result = await axios.post(`${API_URL}/admin/items/add`, {
          ...item,
          status: item.status || 'pending' // Ensure status is set
        });
      }
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/admin/items/delete/${itemId}`);
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle editing an item
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (searchTerm: string) => {
    setFilter(searchTerm);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex justify-center items-start p-4 sm:p-6">
      <div className="ml-4 w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-left">
          Item Management
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 transition shadow-md hover:shadow-lg text-sm font-medium whitespace-nowrap"
          >
            Add Item
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Items List
          </h2>
          <div className="w-full overflow-x-auto">
            <ItemList 
              items={items}
              onEditItem={handleEditItem} 
              onDeleteItem={handleDeleteItem}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {isFormOpen && (
          <div className="z-[150] fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md transform transition scale-95 hover:scale-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                {editingItem ? "Edit Item" : "Add Item"}
              </h2>
              <ItemForm
                onSaveItem={handleSaveItem}
                editingItem={editingItem}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemManagement;