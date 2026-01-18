import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import RequestTable from "../components/RequestTable";
import { LoadCarrierRequestApi } from "../api";
import type { LoadCarrierRequestDto } from "../api";

function isHistory(status: LoadCarrierRequestDto["status"]) {
  return status === "DELIVERED";
}

/* ====================================================== */

export default function WarehousePage() {
  const [requests, setRequests] = useState<LoadCarrierRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ====================================================== */

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await LoadCarrierRequestApi.getAll();
      setRequests(data);
    } catch {
      setError("Failed to load warehouse requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /* ====================================================== */

  const advance = async (id: number) => {
    setIsLoading(true);
    try {
      await LoadCarrierRequestApi.advance(id);
      await loadRequests();
    } catch {
      setError("Failed to update request");
    } finally {
      setIsLoading(false);
    }
  };

  /* ====================================================== */

  const activeRequests = requests.filter((r) => !isHistory(r.status));

  const historyRequests = requests.filter((r) => isHistory(r.status));

  /* ====================================================== */

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
        <>
          <RequestTable
            title="Active Requests"
            requests={activeRequests}
            getActionLabel={(r) =>
              r.status === "REQUESTED"
                ? "Start processing"
                : r.status === "WAREHOUSE_IN_PROGRESS"
                ? "Mark as ready"
                : undefined
            }
            onAction={advance}
          />

          <RequestTable
            title="History"
            requests={historyRequests}
            isHistory={() => true}
          />
        </>
      )}
    </Box>
  );
}
