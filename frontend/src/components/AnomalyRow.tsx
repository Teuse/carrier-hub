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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import type { AnomalyDto, AnomalyStatus } from '../api';

/* ====================================================== */

interface Props {
  anomaly: AnomalyDto;
  onStatusChange?: (
    id: number,
    status: 'ACCEPTED_BY_PQ' | 'DECLINED_BY_PQ'
  ) => void;
  onNotesChange?: (id: number, notes: string) => Promise<void>;
}

/* ====================================================== */

export default function AnomalyRow({ anomaly, onStatusChange, onNotesChange }: Props) {
  const [open, setOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(anomaly.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const isReported = anomaly.status === 'REPORTED';

  const handleEditClick = () => {
    setNotesValue(anomaly.notes ?? '');
    setEditingNotes(true);
  };

  const handleCancel = () => {
    setNotesValue(anomaly.notes ?? '');
    setEditingNotes(false);
  };

  const handleSave = async () => {
    if (!onNotesChange) return;
    setIsSaving(true);
    try {
      await onNotesChange(anomaly.id, notesValue);
      setEditingNotes(false);
    } finally {
      setIsSaving(false);
    }
  };

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
          {onStatusChange && (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton
                size="small"
                color="success"
                disabled={!isReported}
                onClick={() => onStatusChange(anomaly.id, 'ACCEPTED_BY_PQ')}
              >
                <CheckIcon />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                disabled={!isReported}
                onClick={() => onStatusChange(anomaly.id, 'DECLINED_BY_PQ')}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          )}
        </TableCell>
      </TableRow>

      {/* ===== Expanded Row ===== */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>

              {/* Notes — editable */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Notes</Typography>
                {onNotesChange && !editingNotes && (
                  <IconButton size="small" onClick={handleEditClick}>
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
                    disabled={isSaving}
                    autoFocus
                  />
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      color="success"
                      disabled={isSaving}
                      onClick={handleSave}
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={isSaving}
                      onClick={handleCancel}
                    >
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
                Created at: {new Date(anomaly.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Workbench: {anomaly.workbench?.name ?? 'N/A'}
              </Typography>
              {anomaly.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  Updated at: {new Date(anomaly.updatedAt).toLocaleString()}
                </Typography>
              )}

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}