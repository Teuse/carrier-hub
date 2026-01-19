import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';

import { DashboardApi } from '../api/DashboardApi';
import type { DashboardOverviewDto } from '../api/DashboardApi';

/* ====================================================== */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Paper
      sx={{
        p: 3,
        minWidth: 200,
        flex: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">
        {value}
      </Typography>
    </Paper>
  );
}

/* ====================================================== */

export default function Dashboard() {
  const [data, setData] =
    useState<DashboardOverviewDto | null>(null);

  useEffect(() => {
    DashboardApi.getOverview().then(setData);
  }, []);

  if (!data) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* ================= KPI BAR ================= */}
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        sx={{ mb: 4 }}
      >
        <StatCard
          label="Open Requests"
          value={data.openRequests}
        />
        <StatCard
          label="Warehouse Tasks"
          value={data.inWarehouse}
        />
        <StatCard
          label="Logistics Tasks"
          value={data.inLogistics}
        />
        <StatCard
          label="Delivered Today"
          value={data.deliveredToday}
        />
      </Stack>

      {/* ================= LEAD TIME ================= */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Average Lead Time
        </Typography>
        <Typography variant="h3">
          {data.avgLeadTimeMinutes} min
        </Typography>
      </Paper>

      {/* ================= STATUS BREAKDOWN ================= */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Requests by Status
        </Typography>

        <Stack spacing={1}>
          {Object.entries(data.requestsByStatus).map(
            ([status, count]) => (
              <Box
                key={status}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography>{status}</Typography>
                <Typography>{count}</Typography>
              </Box>
            )
          )}
        </Stack>
      </Paper>

      {/* ================= WORKBENCHES ================= */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Open Requests by Workbench
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {data.requestsByWorkbench.length === 0 && (
            <Typography color="text.secondary">
              No open requests
            </Typography>
          )}

          {data.requestsByWorkbench.map((w) => (
            <Box
              key={w.workbenchName}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{w.workbenchName}</Typography>
              <Typography>{w.openRequests}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}