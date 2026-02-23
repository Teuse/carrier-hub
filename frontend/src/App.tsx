import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WorkBenchPage from "./pages/WorkBenchPage";
import LogisticsPage from "./pages/LogisticsPage";
import WarehousePage from "./pages/WarehousePage";
import AnomaliesPage from "./pages/AnomaliesPage";
import WorkbenchManagementPage from "./pages/WorkbenchManagementPage";
import LoadCarrierManagementPage from './pages/LoadCarrierManagementPage';
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import { Box } from "@mui/material";
import { useAuth } from "react-oidc-context";


export default function App() {
  // Validate environment variables
  const requiredVars = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
    VITE_KC_FRONTEND_CLIENT_ID: import.meta.env.VITE_KC_FRONTEND_CLIENT_ID,
    VITE_KC_HTTP_PORT: import.meta.env.VITE_KC_HTTP_PORT
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  const { isAuthenticated, isLoading, error } = useAuth(); 

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (error) {
        return <div>Oops... {error.source} caused {error.message}</div>;
    }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <LoginPage />
      } />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <Header />
          <Box
            component="main"
            sx={{
              minHeight: "calc(100vh - 64px)",
              backgroundColor: "background.default",
              color: "text.primary",
            }}
          >
            <Routes>
              <Route path="/dashboard/overview" element={<Dashboard />} />
              <Route path="/anomalies" element={<AnomaliesPage />} />
              <Route path="/workbench" element={<WorkBenchPage />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/warehouse" element={<WarehousePage />} />
              <Route path="/workbenches/manage" element={<WorkbenchManagementPage />} />
              <Route path="/load-carriers/manage" element={<LoadCarrierManagementPage />} />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
            </Routes>
          </Box>
        </ProtectedRoute>
      } />
    </Routes>

  );
}
