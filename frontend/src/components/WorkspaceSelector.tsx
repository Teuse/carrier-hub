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
import type { WorkspaceDto } from '../api';

interface WorkspaceSelectorProps {
  open: boolean;
  onClose: () => void;

  workspaces: WorkspaceDto[];
  selectedWorkspaceId: number | null;

  onSelect: (id: number) => void;
}

export default function WorkspaceSelector({
  open,
  onClose,
  workspaces,
  selectedWorkspaceId,
  onSelect,
}: WorkspaceSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      workspaces.filter((wb) =>
        wb.name.toLowerCase().includes(search.toLowerCase())
      ),
    [workspaces, search]
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320, p: 2 } }}
    >
      <Typography variant="h6">Select Workspace</Typography>

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
            selected={wb.id === selectedWorkspaceId}
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