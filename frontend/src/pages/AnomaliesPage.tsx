import { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

import { WorkbenchApi } from "../api";
import type { AnomalyDto } from "../api";
import AnomalyTable from "../components/AnomalyTable";

/* ====================================================== */

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AnomalyDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ====================================================== */

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await WorkbenchApi.getAllAnomalies();
      setAnomalies(data);
    } catch {
      setError("Failed to load anomalies");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnomalyStatus = async (
    anomalyId: number,
    status: "ACCEPTED_BY_PQ" | "DECLINED_BY_PQ",
  ) => {
    try {
      await WorkbenchApi.updateAnomaly(anomalyId, { status });
      await loadAnomalies();
    } catch {
      setError("Failed to update anomaly status");
    }
  };

  /* ====================================================== */

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
