import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';

import WorkspaceManagementRow from './WorkspaceManagementRow';
import type { WorkspaceDto } from '../api';

/* ====================================================== */

interface WorkspaceTableProps {
  workspaces: WorkspaceDto[];
  isAdmin: boolean;
  onEdit?: (id: number, fields: { name: string; description?: string }) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

/* ====================================================== */

export default function WorkspaceManagementTable({
  workspaces,
  isAdmin,
  onEdit,
  onDelete,
}: WorkspaceTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {workspaces.map(ws => (
            <WorkspaceManagementRow
              key={ws.id}
              workspace={ws}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}