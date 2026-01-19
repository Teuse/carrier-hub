import {
  Drawer,
  Typography,
  TextField,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { WorkbenchDto } from '../api';

interface WorkbenchSelectorProps {
  open: boolean;
  onClose: () => void;

  workbenches: WorkbenchDto[];
  selectedWorkbenchId: number | null;

  onSelect: (id: number) => void;
}

export default function WorkbenchSelector({
  open,
  onClose,
  workbenches,
  selectedWorkbenchId,
  onSelect,
}: WorkbenchSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      workbenches.filter((wb) =>
        wb.name.toLowerCase().includes(search.toLowerCase())
      ),
    [workbenches, search]
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320, p: 2 } }}
    >
      <Typography variant="h6">Select Workbench</Typography>

      <TextField
        fullWidth
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ my: 2 }}
      />

      <Divider />

      <List>
        {filtered.map((wb) => (
          <ListItemButton
            key={wb.id}
            selected={wb.id === selectedWorkbenchId}
            onClick={() => {
              onSelect(wb.id);
              onClose();
            }}
          >
            <ListItemText
              primary={wb.name}
              secondary={wb.description}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}