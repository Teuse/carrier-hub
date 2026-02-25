import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

import { WorkbenchApi } from "../api";
import type { AnomalyDto } from "../api";
import AnomalyTable from "../components/AnomalyTable";
import { useHttp } from "../hooks/useHttp";

export default function AnomaliesPage() {
  const auth = useAuth();
  const http = useHttp();

  const [anomalies, setAnomalies] = useState<AnomalyDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnomalies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await WorkbenchApi.getAllAnomalies(http);
      setAnomalies(data);
    } catch {
      setError("Failed to load anomalies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) return;
    void loadAnomalies();
  }, [auth.isAuthenticated, auth.user]);

  const updateAnomalyStatus = async (
    anomalyId: number,
    status: "ACCEPTED_BY_PQ" | "DECLINED_BY_PQ",
  ) => {
    try {
      await WorkbenchApi.updateAnomaly(http, anomalyId, { status });
      await loadAnomalies();
    } catch {
      setError("Failed to update anomaly status");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anomalies
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
        <AnomalyTable
          title="Reported Anomalies"
          anomalies={anomalies}
          onStatusChange={updateAnomalyStatus}
        />
      )}
    </Box>
  );
}