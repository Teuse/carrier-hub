import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";

import AnomalyRow from "./AnomalyRow";
import type { AnomalyDto } from "../api";

interface AnomalyTableProps {
  title: string;
  anomalies: AnomalyDto[];
  isAdmin: boolean;
  onStatusChange?: (id: number, status: 'ACCEPTED_BY_PQ' | 'DECLINED_BY_PQ' | 'REPORTED' | 'CLOSED') => void;
  onNotesChange?: (id: number, notes: string) => Promise<void>;
  onEdit?: (id: number, fields: { van?: string; pn?: string; kz?: string }) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export default function AnomalyTable({
  title,
  anomalies,
  isAdmin,
  onStatusChange,
  onNotesChange,
  onEdit,
  onDelete,
}: AnomalyTableProps) {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <colgroup>
            <col style={{ width: 48 }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>VAN</TableCell>
              <TableCell>PN</TableCell>
              <TableCell>KZ</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {anomalies.map((a) => (
              <AnomalyRow
                key={a.id}
                anomaly={a}
                isAdmin={isAdmin}
                onStatusChange={onStatusChange}
                onNotesChange={onNotesChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}