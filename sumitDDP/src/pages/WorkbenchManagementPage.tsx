import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { WorkbenchApi } from '../api';
import type { WorkbenchDto } from '../api';

export default function WorkbenchManagementPage() {
  const [workbenches, setWorkbenches] = useState<WorkbenchDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    setError(null);
    try {
      console.log("Loading workbenches...");
      setWorkbenches(await WorkbenchApi.getAll());
    } catch (e) {
      console.log("Error loading workbenches:", e);
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async () => {
    try {
      await WorkbenchApi.create(name, description || undefined);
      setName('');
      setDescription('');
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  };

  const handleDeactivate = async (id: number) => {
    await WorkbenchApi.deactivate(id);
    await load();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Workbench Management</Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => setOpen(true)}
        >
          Add Workbench
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {workbenches.map((wb) => (
              <TableRow key={wb.id}>
                <TableCell>{wb.name}</TableCell>
                <TableCell>{wb.description ?? '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={wb.active ? 'Active' : 'Inactive'}
                    color={wb.active ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  {wb.active && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleDeactivate(wb.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =========================================================== */}
      {/* Create Dialog                                               */}
      {/* =========================================================== */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Workbench</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!name}
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}