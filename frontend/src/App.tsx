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
import { useIsAuthenticated, useMsal } from '@azure/msal-react';


export default function App() {

  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Show loading while MSAL processes redirect
  if (inProgress === "startup" || inProgress === "handleRedirect") {
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
