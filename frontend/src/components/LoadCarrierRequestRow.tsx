import { useState } from 'react';
import {
  Box,
  TableRow,
  TableCell,
  Collapse,
  IconButton,
  Typography,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import type { LoadCarrierRequestDto } from '../api';

/* ====================================================== */

export interface LoadCarrierRequestRowProps {
  request: LoadCarrierRequestDto;

  /** Optional action button (e.g. Advance) */
  actionLabel?: string;
  onAction?: (id: number) => void;

  /** Disable action button */
  actionDisabled?: boolean;

  /** Mark as history entry (visual only) */
  isHistory?: boolean;
}

/* ====================================================== */

export default function LoadCarrierRequestRow({
  request,
  actionLabel,
  onAction,
  actionDisabled = false,
  isHistory = false,
}: LoadCarrierRequestRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= Collapsed row ================= */}
      <TableRow
        hover
        sx={{
          opacity: isHistory ? 0.6 : 1,
          backgroundColor: isHistory ? '#fafafa' : 'inherit',
        }}
      >
        <TableCell width={48}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography fontWeight="bold">
            {request.loadCarrierName}
          </Typography>
        </TableCell>

        <TableCell>
          {request.workbenchName}
        </TableCell>

        <TableCell>
          <Chip
            label={request.priority}
            color={
              request.priority === 'URGENT'
                ? 'error'
                : request.priority === 'HIGH'
                ? 'warning'
                : 'default'
            }
            size="small"
          />
        </TableCell>

        <TableCell>
          <Chip label={request.status} size="small" />
        </TableCell>

        <TableCell align="right">
          {onAction && actionLabel && (
            <Button
              variant="contained"
              size="small"
              disabled={actionDisabled}
              onClick={() => onAction(request.id)}
            >
              {actionLabel}
            </Button>
          )}
        </TableCell>
      </TableRow>

      {/* ================= Expanded row ================= */}
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
              <Stack spacing={1}>
                <Typography>
                  <strong>Description:</strong>{' '}
                  {request.loadCarrierName || '–'}
                </Typography>

                <Typography>
                  <strong>Comment:</strong>{' '}
                  {request.comment || '–'}
                </Typography>

                <Typography>
                  <strong>Created:</strong>{' '}
                  {new Date(request.createdAt).toLocaleString()}
                </Typography>

                <Typography>
                  <strong>Workbench:</strong>{' '}
                  {request.workbenchName}
                </Typography>

                {isHistory && (
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                  >
                    History entry
                  </Typography>
                )}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}