import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// Admin Pages
import AdminOverview from "./pages/admin/AdminOverview";
import MilkEntryPage from "./pages/admin/MilkEntryPage";
import CustomersPage from "./pages/admin/CustomersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import BuffaloesPage from "./pages/admin/BuffaloesPage";
import ExpensesPage from "./pages/admin/ExpensesPage";
import InventoryPage from "./pages/admin/InventoryPage";
import ReportsPage from "./pages/admin/ReportsPage";
import LogsPage from "./pages/admin/LogsPage";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserOrders from "./pages/user/UserOrders";
import UserPayments from "./pages/user/UserPayments";
import UserProfile from "./pages/user/UserProfile";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (requiredRole === 'user' && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

// Auth Route - Redirect if already logged in
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      } />
      <Route path="/register" element={
        <AuthRoute>
          <RegisterPage />
        </AuthRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminOverview />} />
        <Route path="milk-entry" element={<MilkEntryPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="buffaloes" element={<BuffaloesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>

      {/* User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="user">
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="payments" element={<UserPayments />} />
        <Route path="subscription" element={<UserDashboard />} />
        <Route path="requests" element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
