import { useState, useEffect } from "react";
import { Item } from "../types/Item";

type ItemFormProps = {
  onSaveItem: (item: Item) => void;
  editingItem: Item | null;
  onClose: () => void;
};

const ItemForm = ({
  onSaveItem,
  editingItem,
  onClose,
}: ItemFormProps) => {
  const [serviceNo, setServiceNo] = useState(editingItem?.service_no || "");
  const [name, setName] = useState(editingItem?.name || "");
  const [status, setStatus] = useState(editingItem?.status || "pending");
  const [price, setPrice] = useState(editingItem?.price || "");

  // Reset form when editing item changes
  useEffect(() => {
    setServiceNo(editingItem?.service_no || "");
    setName(editingItem?.name || "");
    setStatus(editingItem?.status || "pending");
    setPrice(editingItem?.price || "");
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Item = {
      id: editingItem?.id || "", // Ensure id is always a string
      service_no: serviceNo,
      name,
      status,
      price,
    };
    onSaveItem(item);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Service No</label>
        <input
          type="text"
          value={serviceNo}
          onChange={(e) => setServiceNo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          required
        >
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="done">Done</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {editingItem ? "Update Item" : "Add Item"}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;