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
  onStatusChange?: (
    id: number,
    status: "ACCEPTED_BY_PQ" | "DECLINED_BY_PQ",
  ) => void;
}

export default function AnomalyTable({
  title,
  anomalies,
  onStatusChange,
}: AnomalyTableProps) {
  const sortedAnomalies = useMemo(
    () =>
      [...anomalies].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
                onStatusChange={onStatusChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
