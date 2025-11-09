import { QRCodeSVG } from 'qrcode.react';

interface QRBadgeProps {
  qrCode: string;
  size?: number;
}

export default function QRBadge({ qrCode, size = 200 }: QRBadgeProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border-2 border-accent">
      <QRCodeSVG value={qrCode} size={size} />
      <p className="mt-2 text-xs text-muted text-center max-w-xs break-all">
        {qrCode}
      </p>
    </div>
  );
}

