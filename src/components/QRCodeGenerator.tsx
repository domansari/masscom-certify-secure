
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  data: string;
  filename?: string;
  size?: number;
}

const QRCodeGenerator = ({ data, size = 200 }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current && data) {
        try {
          await QRCode.toCanvas(canvasRef.current, data, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [data, size]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="border rounded-lg" />
    </div>
  );
};

export default QRCodeGenerator;
