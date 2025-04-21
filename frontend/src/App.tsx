import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Suspense, useEffect, ReactNode } from "react";
import PageLoading from "./components/PageLoading";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import SettingsPage from "./pages/admin/SettingsPage";
import ItemManagement from "./pages/admin/ItemManagement";
import WbotCustomers from "./pages/admin/WbotCustomers";
import ImageUpload from "./pages/admin/ImageUpload";

// Protected route component with proper TypeScript types
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children = [] }: ProtectedRouteProps) => {
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();

  // Check if user is authenticated and has the required role
  const isAuthenticated = !!accessToken;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated, saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    document.title = "Zentex";
  }, []);

  return (
    <Suspense fallback={<PageLoading />}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />

          {/* Protected admin routes */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="Admin/adminhome" element={<AdminHome />} />
            <Route path="Admin/item" element={<ItemManagement />} />
            <Route path="Admin/images" element={<ImageUpload />} />
            <Route path="Admin/setting" element={<SettingsPage />} />
            <Route path="Admin/wbotCustomers" element={<WbotCustomers/>} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;