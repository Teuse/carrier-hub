import { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

import { WorkspaceApi } from "../api";
import type { AnomalyDto } from "../api";
import { isAdmin } from "../auth";
import AnomalyTable from "../components/AnomalyTable";

/* ====================================================== */

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AnomalyDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState(false);

  /* ====================================================== */

  useEffect(() => {
    void isAdmin().then(setAdmin);
    void loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAnomalies(await WorkspaceApi.getAllAnomalies());
    } catch {
      setError("Failed to load anomalies");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnomalyStatus = async (
    anomalyId: number,
    status: 'ACCEPTED_BY_PQ' | 'DECLINED_BY_PQ' | 'REPORTED',
  ) => {
    try {
      await WorkspaceApi.updateAnomaly(anomalyId, { status });
      await loadAnomalies();
    } catch {
      setError("Failed to update anomaly status");
    }
  };

  const updateAnomalyNotes = async (anomalyId: number, notes: string) => {
    try {
      await WorkspaceApi.updateAnomaly(anomalyId, { notes });
      await loadAnomalies();
    } catch {
      setError("Failed to update anomaly notes");
    }
  };

  const updateAnomalyFields = async (
    anomalyId: number,
    fields: { van?: string; pn?: string; kz?: string },
  ) => {
    try {
      await WorkspaceApi.updateAnomaly(anomalyId, fields);
      await loadAnomalies();
    } catch {
      setError("Failed to update anomaly");
    }
  };

  const deleteAnomaly = async (anomalyId: number) => {
    try {
      await WorkspaceApi.deleteAnomaly(anomalyId);
      await loadAnomalies();
    } catch {
      setError("Failed to delete anomaly");
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
          isAdmin={admin}
          onStatusChange={updateAnomalyStatus}
          onNotesChange={updateAnomalyNotes}
          onEdit={updateAnomalyFields}
          onDelete={deleteAnomaly}
        />
      )}
    </Box>
  );
}