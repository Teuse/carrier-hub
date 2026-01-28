import { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import type { AnomalyDto, AnomalyStatus } from '../api';

/* ====================================================== */

interface Props {
  anomaly: AnomalyDto;
  onStatusChange?: (
    id: number,
    status: 'ACCEPTED_BY_PQ' | 'DECLINED_BY_PQ'
  ) => void;
}

/* ====================================================== */

export default function AnomalyRow({ anomaly, onStatusChange }: Props) {
  const [open, setOpen] = useState(false);
  const isReported = anomaly.status === 'REPORTED';

  const statusChip = (status: AnomalyStatus) => {
    switch (status) {
      case 'ACCEPTED_BY_PQ':
        return <Chip label="Accepted" color="success" size="small" />;
      case 'DECLINED_BY_PQ':
        return <Chip label="Declined" color="error" size="small" />;
      default:
        return <Chip label="Reported" size="small" />;
    }
  };

  return (
    <>
      {/* ===== Collapsed Row ===== */}
      <TableRow hover>
        <TableCell width={48}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{anomaly.van ?? '-'}</TableCell>
        <TableCell>{anomaly.pn ?? '-'}</TableCell>
        <TableCell>{anomaly.kz ?? '-'}</TableCell>

        <TableCell>{statusChip(anomaly.status)}</TableCell>

        <TableCell align="right">
          {onStatusChange && (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton
                size="small"
                color="success"
                disabled={!isReported}
                onClick={() =>
                  onStatusChange(anomaly.id, 'ACCEPTED_BY_PQ')
                }
              >
                <CheckIcon />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                disabled={!isReported}
                onClick={() =>
                  onStatusChange(anomaly.id, 'DECLINED_BY_PQ')
                }
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          )}
        </TableCell>
      </TableRow>

      {/* ===== Expanded Row ===== */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              {anomaly.notes && (
                <>
                  <Typography variant="subtitle2">Notes</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {anomaly.notes}
                  </Typography>
                </>
              )}

              <Typography variant="body2" color="text.secondary">
                Created at:{' '}
                {new Date(anomaly.createdAt).toLocaleString()}
                
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Workbench: {anomaly.workbench?.name ?? 'N/A'}
              </Typography>

              {anomaly.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  Updated at:{' '}
                  {new Date(anomaly.updatedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}