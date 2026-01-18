import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

import type { RequestPriority } from '../api';

/* ====================================================== */

interface QrRequestDialogProps {
  open: boolean;
  onClose: () => void;

  onScan: (payload: {
    name: string;
    description?: string;
    comment?: string;
    priority: RequestPriority;
  }) => void;
}

/* ====================================================== */

export default function QrRequestDialog({
  open,
  onClose,
  onScan,
}: QrRequestDialogProps) {
  const readerRef = useRef<HTMLDivElement | null>(null);
  const qrInstanceRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
  if (!open || !readerRef.current) return;

  const qr = new Html5Qrcode(readerRef.current.id);
  qrInstanceRef.current = qr;

  const startScanner = async () => {
    try {
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        console.error('No cameras found');
        return;
      }

      // bevorzugt Rückkamera
      const camera =
        cameras.find((c) =>
          c.label.toLowerCase().includes('back')
        ) || cameras[0];

      await qr.start(
        camera.id,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          try {
            const payload = JSON.parse(decodedText);
            onScan(payload);
            qr.stop();
            onClose();
          } catch {
            console.error('Invalid QR payload');
          }
        },
        () => {}
      );
    } catch (err) {
      console.error('Failed to start camera', err);
    }
  };

  startScanner();

  return () => {
    qr.stop().catch(() => undefined);
  };
}, [open, onScan, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Scan QR Code
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* KEINE feste ID im JSX → React-safe */}
        <div
          ref={readerRef}
          id="qr-reader"
          style={{ width: '100%' }}
        />
      </DialogContent>
    </Dialog>
  );
}