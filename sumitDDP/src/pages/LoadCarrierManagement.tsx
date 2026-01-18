import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

import type { RequestPriority } from '../api';

/* ====================================================== */

const PRIORITIES: RequestPriority[] = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
];

/* ====================================================== */

export default function LoadCarrierManagement() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [priority, setPriority] =
    useState<RequestPriority>('NORMAL');

  /* ====================================================== */

  const qrPayload = useMemo(() => {
    if (!name) return null;

    return JSON.stringify({
      name,
      description: description || undefined,
      comment: comment || undefined,
      priority,
    });
  }, [name, description, comment, priority]);

  /* ====================================================== */

  return (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Generator
      </Typography>

      <Typography sx={{ mb: 3 }} color="text.secondary">
        Create a QR code for requesting a new load carrier at a
        workbench.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          required
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
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as RequestPriority)
          }
          sx={{ mb: 3 }}
        >
          {PRIORITIES.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>

        {qrPayload && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <QRCodeCanvas
              value={qrPayload}
              size={256}
              level="M"
            />

            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1 }}
            >
              Scan this QR code at the workbench
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}