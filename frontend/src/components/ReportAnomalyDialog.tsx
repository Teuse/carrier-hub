import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import type { CreateAnomalyDto } from "../api";

interface Props {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateAnomalyDto) => void;
}

export default function ReportAnomalyDialog({
  open,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateAnomalyDto>({});

  const update =
    (field: keyof CreateAnomalyDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const resetForm = () => {
    setForm({});
  };

  const onReport = (dto: CreateAnomalyDto) => {
    resetForm();
    onSubmit(dto);
  };

  const onCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report Anomaly</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="VAN" value={form.van ?? ""} onChange={update("van")} />
          <TextField label="PN" value={form.pn ?? ""} onChange={update("pn")} />
          <TextField label="KZ" value={form.kz ?? ""} onChange={update("kz")} />
          <TextField
            label="Notes"
            value={form.notes ?? ""}
            onChange={update("notes")}
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={() => onReport(form)}
        >
          Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}