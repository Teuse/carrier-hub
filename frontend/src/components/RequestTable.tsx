import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
} from '@mui/material';

import LoadCarrierRequestRow from './LoadCarrierRequestRow';
import type { LoadCarrierRequestDto } from '../api';

interface RequestTableProps {
  title: string;
  requests: LoadCarrierRequestDto[];

  getActionLabel?: (r: LoadCarrierRequestDto) => string | undefined;
  onAction?: (id: number) => void;

  isHistory?: (r: LoadCarrierRequestDto) => boolean;
}

export default function RequestTable({
  title,
  requests,
  getActionLabel,
  onAction,
  isHistory = () => false,
}: RequestTableProps) {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Workbench</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests.map((r) => (
              <LoadCarrierRequestRow
                key={r.id}
                request={r}
                actionLabel={getActionLabel?.(r)}
                onAction={onAction}
                isHistory={isHistory(r)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}