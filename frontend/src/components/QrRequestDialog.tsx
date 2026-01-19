import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { RequestPriority } from "../api";

import { LoadCarrierApi, type LoadCarrierDto } from "../api/LoadCarrierApi";

export type CreateLoadCarrierRequestPayload = {
  loadCarrierId: number;
  comment?: string;
  priority: RequestPriority;
};

export default function RequestDialog(props: {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLoadCarrierRequestPayload) => void | Promise<void>;
}) {
  const { open, isLoading, onClose, onSubmit } = props;

  const [templates, setTemplates] = useState<LoadCarrierDto[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadCarrierId, setLoadCarrierId] = useState<number | "">("");
  const [priority, setPriority] = useState<RequestPriority>("NORMAL");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    setError(null);
    setTemplatesLoading(true);
    LoadCarrierApi.getAll()
      .then((data) => setTemplates(data))
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Failed to load load carriers",
        ),
      )
      .finally(() => setTemplatesLoading(false));

    // reset fields when opened
    setLoadCarrierId("");
    setPriority("NORMAL");
    setComment("");
  }, [open]);

  const canSubmit =
    loadCarrierId !== "" &&
    priority.trim().length > 0 &&
    !isLoading &&
    !templatesLoading;

  const submit = () => {
    if (loadCarrierId === "") return;
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
                {t.description ? ` — ${t.description}` : ""}
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
            <MenuItem value="LOW">LOW</MenuItem>
            <MenuItem value="NORMAL">NORMAL</MenuItem>
            <MenuItem value="HIGH">HIGH</MenuItem>
            <MenuItem value="URGENT">URGENT</MenuItem>
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
