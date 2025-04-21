import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

type Customer = {
  id: number;
  mobile: string;
  name: string;
  medium: string;
  method: string;
  updatedAt: string;
  service: { service_name_english: string };
  location: { place_time_english: string };
};

export default function WbotCustomers() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const accessToken = localStorage.getItem("accessToken");
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ data: Customer[]; hasMore: boolean }>(
          `${API_URL}/admin/whatsapp-customers?page=${page}&search=${searchQuery}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch customers");
        }

        setCustomers((prev) => (page === 1 ? response.data.data : [...prev, ...response.data.data]));
        setHasMore(response.data.hasMore);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [API_URL, accessToken, page, searchQuery]);

  const lastCustomerRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Wbot Customers</h1>

        {/* Search Input */}
        <div className="mb-4 flex justify-start">
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset pagination on new search
            }}
            className="w-full max-w-lg p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
          />
        </div>

        {/* Responsive Table */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {["#", "Date", "Mobile", "Name", "Address", "repaire item count"].map(
                    (header) => (
                      <th key={header} className="px-4 py-2 text-xs sm:text-sm text-gray-600 text-left">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    ref={index === customers.length - 1 ? lastCustomerRef : null}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.id}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.updatedAt}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.mobile}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.name}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.medium}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.method}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.service.service_name_english}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">{customer.location.place_time_english}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Centered Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-4">
              <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></span>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-center text-red-500 py-4">Error: {error}</div>}
        </div>
      </div>
    </div>
  );
}