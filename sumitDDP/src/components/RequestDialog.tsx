import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { useState } from 'react';

import type { RequestPriority } from '../api';

interface RequestDialogProps {
  open: boolean;
  onClose: () => void;

  onSubmit: (payload: {
    name: string;
    description?: string;
    comment?: string;
    priority: RequestPriority;
  }) => void;

  isLoading?: boolean;
}

const PRIORITIES: RequestPriority[] = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
];

export default function RequestDialog({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: RequestDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [priority, setPriority] =
    useState<RequestPriority>('NORMAL');

  const handleSubmit = () => {
    onSubmit({
      name,
      description: description || undefined,
      comment: comment || undefined,
      priority,
    });

    // reset local state
    setName('');
    setDescription('');
    setComment('');
    setPriority('NORMAL');
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Request new load carrier</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          required
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as RequestPriority)
          }
          sx={{ mt: 2 }}
        >
          {PRIORITIES.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!name || isLoading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}