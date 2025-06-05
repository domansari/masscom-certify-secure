
import { useEffect, useRef } from "react";
import QRCode from 'qrcode';

interface QRCodeSectionProps {
  certificateId: string;
}

const QRCodeSection = ({ certificateId }: QRCodeSectionProps) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (qrCanvasRef.current && certificateId) {
        try {
          const verificationUrl = `${window.location.origin}/verify?id=${certificateId}`;
          await QRCode.toCanvas(qrCanvasRef.current, verificationUrl, {
            width: 80,
            margin: 1,
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [certificateId]);

  return (
    <div className="absolute top-4 right-4 w-20 h-20 bg-white border border-gray-300 rounded flex items-center justify-center z-10">
      <canvas ref={qrCanvasRef} className="w-full h-full" />
    </div>
  );
};

export default QRCodeSection;
