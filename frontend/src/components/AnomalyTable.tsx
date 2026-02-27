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
import { useMemo } from "react";

interface AnomalyTableProps {
  title: string;
  anomalies: AnomalyDto[];
  isAdmin: boolean;
  onStatusChange?: (id: number, status: 'ACCEPTED_BY_PQ' | 'DECLINED_BY_PQ' | 'REPORTED') => void;
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
  const sortedAnomalies = useMemo(
    () =>
      [...anomalies].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [anomalies],
  );

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
              <TableCell>VAN</TableCell>
              <TableCell>PN</TableCell>
              <TableCell>KZ</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedAnomalies.map((a) => (
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