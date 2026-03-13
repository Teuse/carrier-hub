import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlagIcon from '@mui/icons-material/Flag';

import WorkspaceSelector from "../components/WorkspaceSelector";
import RequestLoadCarrierDialog from "../components/RequestLoadCarrierDialog";
import RequestTable from "../components/RequestTable";
import ReportAnomalyDialog from "../components/ReportAnomalyDialog";
import AnomalyTable from "../components/AnomalyTable";

import { useFeatureToggles } from "../context/FeatureToggleContext";
import { useAnomalies } from "../hooks/useAnomalies";
import { WorkspaceApi } from "../api";
import type {
  LoadCarrierRequestDto,
  WorkspaceDto,
  RequestPriority,
  CreateAnomalyDto,
} from "../api";
import { isAdmin } from "../auth";

/* ====================================================== */

const STORAGE_KEY = "selectedWorkspaceId";

/* ====================================================== */

export default function WorkspacePage() {
  /* ---------- general ---------- */
  const [admin, setAdmin] = useState(false);

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
  const openAnomalies = useAnomalies(
    () => WorkspaceApi.getOpenAnomalies(selectedWorkspaceId!),
  );
  const closedAnomalies = useAnomalies(
    () => WorkspaceApi.getClosedAnomalies(selectedWorkspaceId!),
  );

  const [anomalyDialogOpen, setAnomalyDialogOpen] = useState(false);

  /* ---------- history accordion ---------- */
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const handleHistoryToggle = async () => {
    const opening = !historyOpen;
    setHistoryOpen(opening);
    if (opening && !historyLoaded) {
      await closedAnomalies.load();
      setHistoryLoaded(true);
    }
  };

  /* ---------- dialogs ---------- */
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  /* ====================================================== */

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [requests],
  );

  const activeRequests = sortedRequests.filter((r) => r.status !== "DELIVERED");
  const historyRequests = sortedRequests.filter((r) => r.status === "DELIVERED");
  const hasOpenRequest = activeRequests.length > 0;

  const { toggles } = useFeatureToggles();

  /* ====================================================== */
  /* Initial load                                           */
  /* ====================================================== */

  useEffect(() => {
    void isAdmin().then(setAdmin);
    void WorkspaceApi.getAll().then(setWorkspaces);
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      void loadRequests(selectedWorkspaceId);
      void openAnomalies.load();
      // Reset history so it re-fetches for the new workspace on next expand
      setHistoryOpen(false);
      setHistoryLoaded(false);
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
      setRequests(await WorkspaceApi.getRequests(workspaceId));
    } catch {
      setError("Failed to load requests");
    } finally {
      setIsLoading(false);
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
      await openAnomalies.load();
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

        {(error || openAnomalies.error || closedAnomalies.error) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error ?? openAnomalies.error ?? closedAnomalies.error}
          </Alert>
        )}

        {/* ================= Actions ================= */}
        <Stack direction="row" sx={{ mt: 4 }}>
          {selectedWorkspace && (
            <Button
              sx={{ flex: 1, height: 96, fontSize: 18 }}
              variant="contained"
              disabled={isLoading}
              onClick={() => setAnomalyDialogOpen(true)}
            >
              Report Anomaly <FlagIcon sx={{ ml: 1 }}/>
            </Button>
          )}
        </Stack>

        {/* ================= Loading ================= */}
        {isLoading && (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* ================= Tables ================= */}
        {!isLoading && selectedWorkspace && (
          <>
            <AnomalyTable
              title="Reported Anomalies"
              anomalies={openAnomalies.anomalies}
              isAdmin={admin}
              onStatusChange={openAnomalies.updateStatus}
              onNotesChange={openAnomalies.updateNotes}
              onEdit={openAnomalies.updateFields}
              onDelete={openAnomalies.remove}
            />

            <Accordion
              expanded={historyOpen}
              onChange={handleHistoryToggle}
              disableGutters
              elevation={0}
              sx={{ mt: 3, '&:before': { display: 'none' } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ px: 0, flexDirection: 'row-reverse', gap: 1 }}
              >
                <Typography variant="h6">Anomaly History</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                {closedAnomalies.isLoading ? (
                  <Box sx={{ py: 2, textAlign: 'center' }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : (
                  <AnomalyTable
                    title=""
                    anomalies={closedAnomalies.anomalies}
                    isAdmin={admin}
                    onStatusChange={closedAnomalies.updateStatus}
                    onNotesChange={closedAnomalies.updateNotes}
                    onEdit={closedAnomalies.updateFields}
                    onDelete={closedAnomalies.remove}
                  />
                )}
              </AccordionDetails>
            </Accordion>

            {selectedWorkspace && !toggles.anomaliesOnly && (
              <Stack direction="row" sx={{ mt: 4 }}>
                <Button
                  sx={{ flex: 1, height: 96, fontSize: 18 }}
                  variant="outlined"
                  disabled={hasOpenRequest || isLoading}
                  onClick={() => setRequestDialogOpen(true)}
                >
                  Request new load carrier
                </Button>
              </Stack>
            )}

            {!toggles.anomaliesOnly && (
              <RequestTable title="Active Requests" requests={activeRequests} />
            )}
            {!toggles.anomaliesOnly && (
              <RequestTable
                title="History"
                requests={historyRequests}
                isHistory={() => true}
              />
            )}
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