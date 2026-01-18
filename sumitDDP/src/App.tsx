import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WorkBenchPage from "./pages/WorkBenchPage";
import LogisticsPage from "./pages/LogisticsPage";
import WarehousePage from "./pages/WarehousePage";
import WorkbenchManagementPage from "./pages/WorkbenchManagementPage";
import LoadCarrierManagement from './pages/LoadCarrierManagement';
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import { Box } from "@mui/material";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Header />
            <Box
              component="main"
              sx={{
                minHeight: "calc(100vh - 64px)", // AppBar-Höhe
                backgroundColor: "background.default",
                color: "text.primary",
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workbench" element={<WorkBenchPage />} />
                <Route path="/logistics" element={<LogisticsPage />} />
                <Route path="/warehouse" element={<WarehousePage />} />
                <Route
                  path="/workbenches/manage"
                  element={<WorkbenchManagementPage />}
                />
                <Route path="/load-carriers/manage" element={<LoadCarrierManagement />} />
              </Routes>
            </Box>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
