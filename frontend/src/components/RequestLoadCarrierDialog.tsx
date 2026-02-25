import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, MenuItem, CircularProgress, Alert
} from '@mui/material';

import { LoadCarrierApi, type LoadCarrierDto } from '../api/LoadCarrierApi';
import type { RequestPriority } from '../api';
import { useHttp } from '../hooks/useHttp';

export type CreateLoadCarrierRequestPayload = {
  loadCarrierId: number;
  comment?: string;
  priority: RequestPriority;
};

const PRIORITIES: RequestPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

export default function RequestLoadCarrierDialog(props: {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLoadCarrierRequestPayload) => void;
}) {
  const { open, isLoading, onClose, onSubmit } = props;

  const auth = useAuth();
  const http = useHttp();

  const [templates, setTemplates] = useState<LoadCarrierDto[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadCarrierId, setLoadCarrierId] = useState<number | ''>('');
  const [priority, setPriority] = useState<RequestPriority>('NORMAL');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    if (!auth.isAuthenticated || !auth.user) return;

    setError(null);
    setTemplatesLoading(true);
    LoadCarrierApi.getAll(http)
      .then((data) => setTemplates(data))
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Failed to load load carriers')
      )
      .finally(() => setTemplatesLoading(false));

    setLoadCarrierId('');
    setPriority('NORMAL');
    setComment('');
  }, [open, auth.isAuthenticated, auth.user]);

  const canSubmit =
    loadCarrierId !== '' && !isLoading && !templatesLoading;

  const submit = () => {
    if (loadCarrierId === '') return;
    onSubmit({
      loadCarrierId,
      priority,
      comment: comment.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request new load carrier</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            select
            label="Load carrier template"
            value={loadCarrierId}
            onChange={(e) => setLoadCarrierId(Number(e.target.value))}
            disabled={templatesLoading || isLoading}
            fullWidth
            required
          >
            {templatesLoading && (
              <MenuItem value="">
                <CircularProgress size={18} sx={{ mr: 1 }} />
                Loading...
              </MenuItem>
            )}

            {!templatesLoading && templates.length === 0 && (
              <MenuItem value="" disabled>
                No load carriers defined
              </MenuItem>
            )}

            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
                {t.description ? ` — ${t.description}` : ''}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as RequestPriority)}
            disabled={isLoading}
            fullWidth
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit}>
          Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}