import { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { WorkspaceDto } from '../api';

/* ====================================================== */

interface Props {
  workspace: WorkspaceDto;
  isAdmin: boolean;
  onEdit?: (id: number, fields: { name: string; description?: string }) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

/* ====================================================== */

export default function WorkspaceManagementRow({ workspace, isAdmin, onEdit, onDelete }: Props) {
  // MoreVert menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(workspace.name);
  const [editDescription, setEditDescription] = useState(workspace.description ?? '');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ---------- Edit ---------- */

  const openEditDialog = () => {
    setEditName(workspace.name);
    setEditDescription(workspace.description ?? '');
    setMenuAnchor(null);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!onEdit) return;
    setIsSavingEdit(true);
    try {
      await onEdit(workspace.id, {
        name: editName,
        description: editDescription || undefined,
      });
      setEditOpen(false);
    } finally {
      setIsSavingEdit(false);
    }
  };

  /* ---------- Delete ---------- */

  const openDeleteDialog = () => {
    setMenuAnchor(null);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(workspace.id);
      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ====================================================== */

  return (
    <>
      <TableRow hover>
        <TableCell>{workspace.name}</TableCell>
        <TableCell>{workspace.description ?? '-'}</TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={e => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={openEditDialog} disabled={!isAdmin}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={openDeleteDialog} disabled={!isAdmin} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color={isAdmin ? 'error' : 'disabled'} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>

      {/* ===== Edit Dialog ===== */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Workspace</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              size="small"
              fullWidth
              value={editName}
              onChange={e => setEditName(e.target.value)}
              disabled={isSavingEdit}
            />
            <TextField
              label="Description"
              size="small"
              fullWidth
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              disabled={isSavingEdit}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={isSavingEdit}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            disabled={isSavingEdit || !editName}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Delete Confirmation Dialog ===== */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Workspace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{workspace.name}</strong>? All Anomalies associated with this Workspace will be deleted, as well. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={isDeleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}