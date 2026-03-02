import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import WorkspaceSelector from "../components/WorkspaceSelector";
import RequestLoadCarrierDialog from "../components/RequestLoadCarrierDialog";
import RequestTable from "../components/RequestTable";
import ReportAnomalyDialog from "../components/ReportAnomalyDialog";

import { WorkspaceApi } from "../api";
import type {
  LoadCarrierRequestDto,
  WorkspaceDto,
  RequestPriority,
  AnomalyDto,
  CreateAnomalyDto,
} from "../api";
import AnomalyTable from "../components/AnomalyTable";

/* ====================================================== */

const STORAGE_KEY = "selectedWorkspaceId";

/* ====================================================== */

export default function WorkspacePage() {
  /* ---------- sidebar ---------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------- workspaces ---------- */
  const [workspaces, setWorkspaces] = useState<WorkspaceDto[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? Number(stored) : null;
    },
  );

  /* ---------- requests ---------- */
  const [requests, setRequests] = useState<LoadCarrierRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- anomalies ---------- */
  const [anomalies, setAnomalies] = useState<AnomalyDto[]>([]);
  const [anomalyDialogOpen, setAnomalyDialogOpen] = useState(false);

  /* ---------- dialogs ---------- */
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  /* ====================================================== */

  const selectedWorkspace = workspaces.find(
    (w) => w.id === selectedWorkspaceId,
  );

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [requests],
  );

  const activeRequests = sortedRequests.filter((r) => r.status !== "DELIVERED");
  const historyRequests = sortedRequests.filter(
    (r) => r.status === "DELIVERED",
  );

  const hasOpenRequest = activeRequests.length > 0;

  /* ====================================================== */
  /* Initial load                                           */
  /* ====================================================== */

  useEffect(() => {
    WorkspaceApi.getActive().then(setWorkspaces);
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      loadRequests(selectedWorkspaceId);
      loadAnomalies(selectedWorkspaceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspaceId]);

  /* ====================================================== */
  /* Loaders                                                */
  /* ====================================================== */

  const loadRequests = async (workspaceId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await WorkspaceApi.getRequests(workspaceId);
      setRequests(data);
    } catch {
      setError("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnomalies = async (workspaceId: number) => {
    try {
      const data = await WorkspaceApi.getAnomalies(workspaceId);
      setAnomalies(data);
    } catch {
      setError("Failed to load anomalies");
    }
  };

  /* ====================================================== */
  /* Create request                                         */
  /* ====================================================== */

  const createRequest = async (payload: {
    loadCarrierId: number;
    comment?: string;
    priority: RequestPriority;
  }) => {
    if (!selectedWorkspaceId) return;

    setIsLoading(true);
    setError(null);

    try {
      await WorkspaceApi.requestNew(selectedWorkspaceId, payload);
      setRequestDialogOpen(false);
      await loadRequests(selectedWorkspaceId);
    } catch {
      setError("Failed to create request");
    } finally {
      setIsLoading(false);
    }
  };

  /* ====================================================== */
  /* Create anomaly                                         */
  /* ====================================================== */

  const createAnomaly = async (payload: CreateAnomalyDto) => {
    if (!selectedWorkspaceId) return;

    setIsLoading(true);
    setError(null);

    try {
      await WorkspaceApi.reportAnomaly(selectedWorkspaceId, payload);
      setAnomalyDialogOpen(false);
      await loadAnomalies(selectedWorkspaceId);
    } catch {
      setError("Failed to report anomaly");
    } finally {
      setIsLoading(false);
    }
  };

  /* ====================================================== */

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* ================= Sidebar ================= */}
      <WorkspaceSelector
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        workspaces={workspaces}
        selectedWorkspaceId={selectedWorkspaceId}
        onSelect={(id) => {
          setSelectedWorkspaceId(id);
          localStorage.setItem(STORAGE_KEY, String(id));
        }}
      />

      {/* ================= Main ================= */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h4">
            {selectedWorkspace?.name ?? "Workspace"}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* ================= Actions ================= */}
        {selectedWorkspace && (
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              sx={{ flex: 1, height: 96, fontSize: 20 }}
              variant="contained"
              disabled={hasOpenRequest || isLoading}
              onClick={() => setRequestDialogOpen(true)}
            >
              Request new load carrier
            </Button>

            <Button
              sx={{ width: 400, fontSize: 18 }}
              variant="outlined"
              disabled={isLoading}
              onClick={() => setAnomalyDialogOpen(true)}
            >
              Report Anomaly
            </Button>
          </Stack>
        )}

        {/* ================= Loading ================= */}
        {isLoading && (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* ================= Tables ================= */}
        {!isLoading && selectedWorkspace && (
          <>
            <RequestTable title="Active Requests" requests={activeRequests} />
            <RequestTable
              title="History"
              requests={historyRequests}
              isHistory={() => true}
            />
            <AnomalyTable title="Reported Anomalies" anomalies={anomalies} isAdmin={false} />
          </>
        )}
      </Box>

      {/* ================= Dialogs ================= */}
      <RequestLoadCarrierDialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        onSubmit={createRequest}
        isLoading={isLoading}
      />

      <ReportAnomalyDialog
        open={anomalyDialogOpen}
        isLoading={isLoading}
        onClose={() => setAnomalyDialogOpen(false)}
        onSubmit={createAnomaly}
      />
    </Box>
  );
}
