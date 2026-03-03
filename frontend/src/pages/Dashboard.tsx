import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts';

import { DashboardApi } from '../api/DashboardApi';
import type { DashboardOverviewDto, DashboardChartDto } from '../api/DashboardApi';

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

  const [chart, setChart] =
    useState<DashboardChartDto | null>(null);

  useEffect(() => {
    DashboardApi.getOverview().then(setData);
    DashboardApi.getChartData().then(setChart)
  }, []);

  if (!data || !chart) {
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

      {/* ================= Charts ================= */}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">Anomalies by Status (last 7 days)</Typography>
          <PieChart
            series={[
              {
                data: Object.entries(chart.anomaliesByStatusInWeek).map(
                  ([label, value], index) => ({ id: index, value, label }))
              }
            ]}
            width={400}
            height={300}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">% of Anomalies by Workspace</Typography>          
          <BarChart
            dataset={chart.anomaliesPerWorkspace}
            xAxis={[{ dataKey: 'name', scaleType: 'band', label: 'Workspace' }]}
            yAxis={[{ label: 'Anomaly %' }]}
            series={[{ dataKey: 'anomalyPercentage' }]}
            height={300}
          />
        </Box>
      </Box>

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

      {/* ================= WORKSPACES ================= */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Open Requests by Workspace
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {data.requestsByWorkspace.length === 0 && (
            <Typography color="text.secondary">
              No open requests
            </Typography>
          )}

          {data.requestsByWorkspace.map((w) => (
            <Box
              key={w.workspaceName}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{w.workspaceName}</Typography>
              <Typography>{w.openRequests}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}