import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';

import { QRCodeCanvas } from 'qrcode.react';

import {
  LoadCarrierApi,
  type LoadCarrierDto,
  type CreateItemDto,
  type CreateLoadCarrierDto,
  type UpdateLoadCarrierDto,
} from '../api/LoadCarrierApi';

/* ====================================================== */
/* Small helpers                                           */
/* ====================================================== */

type Mode = 'create' | 'edit';

function isoToReadable(iso: string): string {
  // simple readable timestamp; keep it deterministic
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

/* ====================================================== */
/* Edit/Create Dialog                                      */
/* ====================================================== */

type EditFormState = {
  name: string;
  description: string;
  qrCode: string;
  items: CreateItemDto[];
};

function toEditFormState(existing?: LoadCarrierDto): EditFormState {
  return {
    name: existing?.name ?? '',
    description: existing?.description ?? '',
    qrCode: existing?.qrCode ?? '',
    items:
      existing?.items?.map((i) => ({
        name: i.name,
        description: i.description ?? '',
        count: i.count,
      })) ?? [],
  };
}

function isValidForm(s: EditFormState): boolean {
  if (!s.name.trim()) return false;
  if (!s.qrCode.trim()) return false;
  // items optional; but if present, require name + count >=1
  for (const it of s.items) {
    if (!it.name.trim()) return false;
    if (!Number.isFinite(it.count) || it.count < 0) return false;
  }
  return true;
}

function LoadCarrierEditDialog(props: {
  open: boolean;
  mode: Mode;
  initial?: LoadCarrierDto;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLoadCarrierDto | UpdateLoadCarrierDto) => void;
}) {
  const { open, mode, initial, isLoading, onClose, onSubmit } = props;
  const [form, setForm] = useState<EditFormState>(() => toEditFormState(initial));

  useEffect(() => {
    if (open) setForm(toEditFormState(initial));
  }, [open, initial]);

  const title = mode === 'create' ? 'Create Load Carrier' : 'Edit Load Carrier';

  const handleItemChange = (
    idx: number,
    patch: Partial<CreateItemDto>
  ) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], ...patch };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', count: 1 }],
    }));
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      const items = [...prev.items];
      items.splice(idx, 1);
      return { ...prev, items };
    });
  };

  const submit = () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      qrCode: form.qrCode.trim(),
      items: form.items.map((i) => ({
        name: i.name.trim(),
        description: i.description?.trim() || undefined,
        count: Number(i.count),
      })),
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            fullWidth
            multiline
            minRows={2}
          />

          <TextField
            label="QR Code"
            value={form.qrCode}
            onChange={(e) => setForm((p) => ({ ...p, qrCode: e.target.value }))}
            fullWidth
            required
            helperText="The QR code should contain a stable identifier (e.g., LC-XXXX)."
          />

          <Divider />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Items</Typography>
            <Button variant="outlined" onClick={addItem}>
              Add Item
            </Button>
          </Stack>

          {form.items.length === 0 && (
            <Typography color="text.secondary">
              No items defined (optional).
            </Typography>
          )}

          {form.items.map((it, idx) => (
            <Paper key={idx} sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Item Name"
                    value={it.name}
                    onChange={(e) => handleItemChange(idx, { name: e.target.value })}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Count"
                    type="number"
                    value={it.count}
                    onChange={(e) =>
                      handleItemChange(idx, { count: Number(e.target.value) })
                    }
                    sx={{ width: 140 }}
                    inputProps={{ min: 0 }}
                    required
                  />
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => removeItem(idx)}
                  >
                    Remove
                  </Button>
                </Stack>

                <TextField
                  label="Item Description"
                  value={it.description ?? ''}
                  onChange={(e) =>
                    handleItemChange(idx, { description: e.target.value })
                  }
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={submit}
          disabled={!isValidForm(form) || isLoading}
        >
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ====================================================== */
/* QR Code Dialog                                          */
/* ====================================================== */

function QrCodeDialog(props: {
  open: boolean;
  title: string;
  qrValue: string;
  onClose: () => void;
}) {
  const { open, title, qrValue, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <QRCodeCanvas value={qrValue} size={280} level="M" />
        </Box>

        <Typography variant="body2" color="text.secondary">
          QR value:
        </Typography>
        <Typography sx={{ wordBreak: 'break-all' }}>{qrValue}</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ====================================================== */
/* Page                                                    */
/* ====================================================== */

export default function LoadCarrierManagementPage() {
  const [rows, setRows] = useState<LoadCarrierDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<Mode>('create');
  const [editTarget, setEditTarget] = useState<LoadCarrierDto | undefined>(undefined);

  const [qrOpen, setQrOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrTitle, setQrTitle] = useState('');

  const sorted = useMemo(() => {
    // newest updated first
    return [...rows].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [rows]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await LoadCarrierApi.getAll();
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load load carriers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditMode('create');
    setEditTarget(undefined);
    setEditOpen(true);
  };

  const openEdit = (r: LoadCarrierDto) => {
    setEditMode('edit');
    setEditTarget(r);
    setEditOpen(true);
  };

  const submitEdit = async (payload: CreateLoadCarrierDto | UpdateLoadCarrierDto) => {
    setIsLoading(true);
    setError(null);

    try {
      if (editMode === 'create') {
        await LoadCarrierApi.create(payload as CreateLoadCarrierDto);
      } else {
        if (!editTarget) return;
        await LoadCarrierApi.update(editTarget.id, payload as UpdateLoadCarrierDto);
      }

      setEditOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: number) => {
    // keep it simple: no confirm dialog here; add if desired
    setIsLoading(true);
    setError(null);

    try {
      await LoadCarrierApi.remove(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setIsLoading(false);
    }
  };

  const showQr = (r: LoadCarrierDto) => {
    setQrTitle(`QR Code – ${r.name}`);
    setQrValue(r.qrCode);
    setQrOpen(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Load Carrier Management</Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={load} disabled={isLoading}>
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={isLoading}
          >
            Create
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mt: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Load Carriers
          </Typography>
          {isLoading && <CircularProgress size={22} />}
        </Box>
        <Divider />

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 80 }}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>QR Code</TableCell>
              <TableCell sx={{ width: 120 }}>Items</TableCell>
              <TableCell sx={{ width: 220 }}>Updated</TableCell>
              <TableCell sx={{ width: 180 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">
                    No load carriers found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {sorted.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{r.name}</Typography>
                  {r.description && (
                    <Typography variant="body2" color="text.secondary">
                      {r.description}
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={{ fontFamily: 'monospace' }}>{r.qrCode}</TableCell>

                <TableCell>{r.items?.length ?? 0}</TableCell>

                <TableCell>{isoToReadable(r.updatedAt)}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton onClick={() => showQr(r)} title="Show QR code">
                      <QrCode2Icon />
                    </IconButton>

                    <IconButton onClick={() => openEdit(r)} title="Edit">
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => remove(r.id)}
                      title="Delete"
                      color="error"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <LoadCarrierEditDialog
        open={editOpen}
        mode={editMode}
        initial={editTarget}
        isLoading={isLoading}
        onClose={() => setEditOpen(false)}
        onSubmit={submitEdit}
      />

      <QrCodeDialog
        open={qrOpen}
        title={qrTitle}
        qrValue={qrValue}
        onClose={() => setQrOpen(false)}
      />
    </Box>
  );
}