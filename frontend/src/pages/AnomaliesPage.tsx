import { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

import { WorkspaceApi } from "../api";
import { useAnomalies } from "../hooks/useAnomalies";
import { isAdmin } from "../auth";
import AnomalyTable from "../components/AnomalyTable";
/* ====================================================== */

export default function AnomaliesPage() {
  const { anomalies, isLoading, error, load, updateStatus, updateNotes, updateFields, remove } =
    useAnomalies(WorkspaceApi.getAllAnomalies);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    void isAdmin().then(setAdmin);
    void load();
  }, []);


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
          onStatusChange={updateStatus}
          onNotesChange={updateNotes}
          onEdit={updateFields}
          onDelete={remove}
        />
      )}
    </Box>
  );
}