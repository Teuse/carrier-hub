import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { WorkspaceApi } from '../api';
import type { WorkspaceDto } from '../api';
import { isAdmin } from '../auth';
import WorkspaceManagementTable from '../components/WorkspaceManagementTable';

/* ====================================================== */

export default function WorkspaceManagementPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState(false);

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  /* ====================================================== */

  useEffect(() => {
    void isAdmin().then(setAdmin);
    void load();
  }, []);

  const load = async () => {
    setError(null);
    try {
      setWorkspaces(await WorkspaceApi.getAll());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  };

  /* ====================================================== */

  const handleCreate = async () => {
    try {
      await WorkspaceApi.create(name, description || undefined);
      setName('');
      setDescription('');
      setCreateOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  };

  const handleEdit = async (
    id: number,
    fields: { name: string; description?: string },
  ) => {
    try {
      await WorkspaceApi.update(id, fields);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await WorkspaceApi.delete(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  /* ====================================================== */

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Workspace Management</Typography>

        <Button
          variant="contained"
          size="large"
          disabled={!admin}
          onClick={() => setCreateOpen(true)}
        >
          Add Workspace
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <WorkspaceManagementTable
        workspaces={workspaces}
        isAdmin={admin}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ===== Create Dialog ===== */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{admin ? 'Add Workspace' : 'Add Workspace (Admins only)'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!name || !admin}
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}