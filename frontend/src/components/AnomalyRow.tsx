import { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Box,
  Typography,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import type { AnomalyDto, AnomalyStatus } from '../api';

/* ====================================================== */

interface Props {
  anomaly: AnomalyDto;
  isAdmin: boolean;
  onStatusChange?: (id: number, status: AnomalyStatus) => void;
  onNotesChange?: (id: number, notes: string) => Promise<void>;
  onEdit?: (id: number, fields: { van?: string; pn?: string; kz?: string }) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

/* ====================================================== */

export default function AnomalyRow({
  anomaly,
  isAdmin,
  onStatusChange,
  onNotesChange,
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  // Notes editing
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(anomaly.notes ?? '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // MoreVert menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editVan, setEditVan] = useState(anomaly.van ?? '');
  const [editPn, setEditPn] = useState(anomaly.pn ?? '');
  const [editKz, setEditKz] = useState(anomaly.kz ?? '');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ---------- Notes ---------- */

  const handleNotesEdit = () => {
    setNotesValue(anomaly.notes ?? '');
    setEditingNotes(true);
  };

  const handleNotesSave = async () => {
    if (!onNotesChange) return;
    setIsSavingNotes(true);
    try {
      await onNotesChange(anomaly.id, notesValue);
      setEditingNotes(false);
    } finally {
      setIsSavingNotes(false);
    }
  };

  /* ---------- Edit dialog ---------- */

  const openEditDialog = () => {
    setEditVan(anomaly.van ?? '');
    setEditPn(anomaly.pn ?? '');
    setEditKz(anomaly.kz ?? '');
    setMenuAnchor(null);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!onEdit) return;
    setIsSavingEdit(true);
    try {
      await onEdit(anomaly.id, {
        van: editVan || undefined,
        pn: editPn || undefined,
        kz: editKz || undefined,
      });
      setEditOpen(false);
    } finally {
      setIsSavingEdit(false);
    }
  };

  /* ---------- Delete dialog ---------- */

  const openDeleteDialog = () => {
    setMenuAnchor(null);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(anomaly.id);
      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ---------- Helpers ---------- */

  const statusChip = (status: AnomalyStatus) => {
    switch (status) {
      case 'ACCEPTED_BY_PQ':
        return <Chip label="Accepted" color="success" size="small" />;
      case 'DECLINED_BY_PQ':
        return <Chip label="Declined" color="error" size="small" />;
      default:
        return <Chip label="Reported" size="small" />;
    }
  };

  /* ====================================================== */

  return (
    <>
      {/* ===== Collapsed Row ===== */}
      <TableRow hover>
        <TableCell width={48}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{anomaly.van ?? '-'}</TableCell>
        <TableCell>{anomaly.pn ?? '-'}</TableCell>
        <TableCell>{anomaly.kz ?? '-'}</TableCell>
        <TableCell>{statusChip(anomaly.status)}</TableCell>

        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
            {onStatusChange && (
              <>
                <IconButton
                  size="small"
                  color="success"
                  disabled={anomaly.status === 'ACCEPTED_BY_PQ'}
                  onClick={() => onStatusChange(
                    anomaly.id,
                    anomaly.status === 'ACCEPTED_BY_PQ' ? 'REPORTED' : 'ACCEPTED_BY_PQ'
                  )}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  disabled={anomaly.status === 'DECLINED_BY_PQ'}
                  onClick={() => onStatusChange(
                    anomaly.id,
                    anomaly.status === 'DECLINED_BY_PQ' ? 'REPORTED' : 'DECLINED_BY_PQ'
                  )}
                >
                  <CloseIcon />
                </IconButton>
              </>
            )}

            <IconButton size="small" onClick={e => setMenuAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Stack>

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

      {/* ===== Expanded Row ===== */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>

              {/* Notes */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Notes</Typography>
                {onNotesChange && !editingNotes && (
                  <IconButton size="small" onClick={handleNotesEdit}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Stack>

              {editingNotes ? (
                <Stack spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    multiline
                    minRows={2}
                    size="small"
                    fullWidth
                    value={notesValue}
                    onChange={e => setNotesValue(e.target.value)}
                    disabled={isSavingNotes}
                    autoFocus
                  />
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="success" disabled={isSavingNotes} onClick={handleNotesSave}>
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" disabled={isSavingNotes} onClick={() => setEditingNotes(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ mb: 1 }} color={anomaly.notes ? 'text.primary' : 'text.disabled'}>
                  {anomaly.notes ?? 'No notes'}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary">
                Created by: {anomaly.createdBy ?? 'N/A'}
              </Typography>
              {anomaly.reviewedBy && (
                <Typography variant="body2" color="text.secondary">
                  Accepted/Declined by: {anomaly.reviewedBy}
                </Typography>
              )}
              {anomaly.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  Updated at: {new Date(anomaly.updatedAt).toLocaleString()}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Created at: {new Date(anomaly.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Workspace: {anomaly.workspace?.name ?? 'N/A'}
              </Typography>

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* ===== Edit Dialog ===== */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Anomaly</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="VAN"
              size="small"
              fullWidth
              value={editVan}
              onChange={e => setEditVan(e.target.value)}
              disabled={isSavingEdit}
            />
            <TextField
              label="PN"
              size="small"
              fullWidth
              value={editPn}
              onChange={e => setEditPn(e.target.value)}
              disabled={isSavingEdit}
            />
            <TextField
              label="KZ"
              size="small"
              fullWidth
              value={editKz}
              onChange={e => setEditKz(e.target.value)}
              disabled={isSavingEdit}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={isSavingEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={isSavingEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ===== Delete Confirmation Dialog ===== */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Anomaly</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this anomaly? This action cannot be undone.
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