import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import WorkbenchSelector from '../components/WorkbenchSelector';
import RequestDialog from '../components/RequestDialog';
import QrRequestDialog from '../components/QrRequestDialog';
import RequestTable from '../components/RequestTable';

import { WorkbenchApi } from '../api';
import type {
  LoadCarrierRequestDto,
  WorkbenchDto,
  RequestPriority,
} from '../api';

/* ====================================================== */

const STORAGE_KEY = 'selectedWorkbenchId';

/* ====================================================== */

export default function WorkbenchPage() {
  /* ---------- sidebar ---------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------- workbenches ---------- */
  const [workbenches, setWorkbenches] = useState<WorkbenchDto[]>([]);
  const [selectedWorkbenchId, setSelectedWorkbenchId] = useState<number | null>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? Number(stored) : null;
    }
  );

  /* ---------- requests ---------- */
  const [requests, setRequests] = useState<LoadCarrierRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- dialogs ---------- */
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  /* ====================================================== */

  const selectedWorkbench = workbenches.find(
    (w) => w.id === selectedWorkbenchId
  );

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [requests]
  );

  const activeRequests = sortedRequests.filter(
    (r) => r.status !== 'DELIVERED'
  );

  const historyRequests = sortedRequests.filter(
    (r) => r.status === 'DELIVERED'
  );

  const hasOpenRequest = activeRequests.length > 0;

  /* ====================================================== */

  useEffect(() => {
    WorkbenchApi.getActive().then(setWorkbenches);
  }, []);

  useEffect(() => {
    if (selectedWorkbenchId) {
      loadRequests(selectedWorkbenchId);
    }
  }, [selectedWorkbenchId]);

  const loadRequests = async (workbenchId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await WorkbenchApi.getRequests(workbenchId);
      setRequests(data);
    } catch {
      setError('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  /* ====================================================== */
  /* Request creation                                      */
  /* ====================================================== */

  const createRequest = async (payload: {
    name: string;
    description?: string;
    comment?: string;
    priority: RequestPriority;
  }) => {
    if (!selectedWorkbenchId) return;

    setIsLoading(true);
    setError(null);

    try {
      await WorkbenchApi.requestNew(
        selectedWorkbenchId,
        payload
      );

      setRequestDialogOpen(false);
      setQrDialogOpen(false);

      await loadRequests(selectedWorkbenchId);
    } catch {
      setError('Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  /* ====================================================== */

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* ================= Sidebar ================= */}
      <WorkbenchSelector
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        workbenches={workbenches}
        selectedWorkbenchId={selectedWorkbenchId}
        onSelect={(id) => {
          setSelectedWorkbenchId(id);
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
            {selectedWorkbench?.name ?? 'Workbench'}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* ================= Actions ================= */}
        {selectedWorkbench && (
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
              sx={{ width: 96, fontSize: 18 }}
              variant="outlined"
              disabled={hasOpenRequest || isLoading}
              onClick={() => setQrDialogOpen(true)}
            >
              QR
            </Button>
          </Stack>
        )}

        {/* ================= Loading ================= */}
        {isLoading && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        )}

        {/* ================= Tables ================= */}
        {!isLoading && selectedWorkbench && (
          <>
            <RequestTable
              title="Active Requests"
              requests={activeRequests}
            />

            <RequestTable
              title="History"
              requests={historyRequests}
              isHistory={() => true}
            />
          </>
        )}
      </Box>

      {/* ================= Dialogs ================= */}
      <RequestDialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        onSubmit={createRequest}
        isLoading={isLoading}
      />

      <QrRequestDialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        onScan={createRequest}
      />
    </Box>
  );
}