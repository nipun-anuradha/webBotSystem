import { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      checkConnection(storedToken);
    }
  }, []);

  const checkConnection = async (storedToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/is-connected`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      setIsConnected(response.data.isConnected);
      if (response.data.isConnected) {
        setQrCodeUrl(null);
      }
    } catch (error) {
      console.error("Failed to check connection", error);
      setError("Failed to check connection");
    }
  };

  const generateQrCode = async () => {
    if (!token) return;
    setLoading(true);
    setQrCodeUrl(null);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/admin/generate-qr`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQrCodeUrl(response.data.QrCode);
      setLoading(false);

      setTimeout(() => checkConnection(token), 5000);
    } catch (error) {
      console.error("Failed to generate QR code", error);
      setError("Failed to generate QR code");
      setLoading(false);
    }
  };

  const disconnectWhatsApp = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/admin/whatsapp-logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.logout) {
        setIsConnected(false);
        setQrCodeUrl(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to disconnect", error);
      setError("Failed to disconnect");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!qrCodeUrl || isConnected) return;

    const intervalId = setInterval(() => {
      generateQrCode();
    }, 20000);

    return () => clearInterval(intervalId);
  }, [qrCodeUrl, isConnected]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 items-start w-1/2 sm:w-1/2 md:w-1/4 ml-0 rounded-2xl shadow-md">
        <h1 className="text-3xl sm:text-3xl font-semibold text-gray-700 mb-4 sm:mb-6">
          Settings
        </h1>

        {isConnected && (
          <div className="text-purple-600 mb-4 text-center">
            WhatsApp is connected! ✓
          </div>
        )}

        <div className="flex justify-center mb-4 sm:mb-6">
          {isConnected ? (
            <button
              onClick={disconnectWhatsApp}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
              disabled={loading}
            >
              {loading ? "Disconnecting..." : "Disconnect"}
            </button>
          ) : (
            <button
              onClick={generateQrCode}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "Connect"}
            </button>
          )}
        </div>

        {!isConnected && qrCodeUrl && (
          <div className="flex flex-col items-start space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl text-gray-800 font-semibold">
              Scan QR Code
            </h2>
            <div className="flex justify-start">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="rounded-md shadow"
              />
            </div>
            <p className="text-gray-600 text-sm text-left">
              Scan this QR code to connect your account with our service.
            </p>
          </div>
        )}

        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default SettingsPage;
