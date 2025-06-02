
import { QrCode } from "lucide-react";
import { useEffect, useRef } from "react";
import QRCode from 'qrcode';

interface CertificateData {
  studentName: string;
  fatherName: string;
  courseName: string;
  duration: string;
  completionDate: string;
  grade: string;
  studentCoordinator: string;
  certificateId: string;
  rollNo?: string;
}

interface CertificatePreviewProps {
  data: CertificateData;
}

const CertificatePreview = ({ data }: CertificatePreviewProps) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (qrCanvasRef.current && data.certificateId) {
        try {
          const verificationUrl = `${window.location.origin}/verify?id=${data.certificateId}`;
          await QRCode.toCanvas(qrCanvasRef.current, verificationUrl, {
            width: 64,
            margin: 1,
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [data.certificateId]);

  return (
    <div 
      className="certificate-container relative bg-white shadow-lg mx-auto certificate-bg"
      style={{
        width: '210mm',
        height: '297mm',
        transform: 'scale(0.4)',
        transformOrigin: 'top left',
        padding: '20mm',
        fontFamily: 'Times, serif',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '8px solid',
        borderImage: 'linear-gradient(45deg, #2563eb, #fbbf24, #2563eb) 1'
      }}
    >
      {/* Certificate ID - Extreme Left Top Corner */}
      <div className="absolute top-4 left-4 text-sm font-bold text-black">
        Certificate ID: {data.certificateId || "Generated ID"}
      </div>

      {/* QR Code - Extreme Right Top Corner */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-white border border-gray-300 rounded flex items-center justify-center">
        <canvas ref={qrCanvasRef} className="w-full h-full" />
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/6bb1665e-2bc0-4761-a747-55431e93f784.png" 
          alt="Institute Logo" 
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Institute Name */}
      <div className="text-center mb-2">
        <h1 className="text-4xl font-bold text-blue-800 uppercase tracking-wide">
          MASSCOM INFOTECH EDUCATION
        </h1>
      </div>

      {/* Subtitle */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-700 italic">
          [An Autonomous Institution Registered Under The Public Trust Act.]
        </p>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-600 uppercase tracking-widest">
          CERTIFICATE
        </h2>
        <p className="text-xl text-gray-700 mt-2">Of Achievement</p>
      </div>

      {/* Certificate Content */}
      <div className="text-center space-y-6">
        <p className="text-xl text-gray-800">
          This is to certify that
        </p>
        
        <div className="border-b-2 border-black pb-2 mx-16">
          <h3 className="text-3xl font-bold text-black uppercase">
            {data.studentName || "Student Name"}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
          <div>
            <p className="text-lg text-gray-700 mb-1">S/O, D/O:</p>
            <div className="border-b border-black pb-1">
              <p className="text-xl font-semibold">{data.fatherName || "Father's Name"}</p>
            </div>
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-1">Roll No:</p>
            <div className="border-b border-black pb-1">
              <p className="text-xl font-semibold">{data.rollNo || "Roll Number"}</p>
            </div>
          </div>
        </div>

        <p className="text-xl text-gray-800">
          has successfully completed the course of
        </p>

        <div className="border-b-2 border-black pb-2 mx-20">
          <h4 className="text-2xl font-bold text-black">
            {data.courseName || "Course Name"}
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
          <div>
            <p className="text-lg text-gray-700 mb-1">Duration:</p>
            <div className="border-b border-black pb-1">
              <p className="text-xl font-semibold">{data.duration || "Duration"}</p>
            </div>
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-1">Grade:</p>
            <div className="border-b border-black pb-1">
              <p className="text-xl font-semibold">{data.grade || "Grade"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 text-left max-w-2xl mx-auto">
          <div>
            <p className="text-lg text-gray-700 mb-1">Completion Date:</p>
            <div className="border-b border-black pb-1">
              <p className="text-xl font-semibold">
                {data.completionDate ? new Date(data.completionDate).toLocaleDateString() : "Date"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-1">Student Co-ordinator:</p>
            <div className="border-b border-black pb-1">
              <p className="text-xl font-semibold">{data.studentCoordinator || "Co-ordinator"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Only Principal/Director Signature */}
      <div className="absolute bottom-32 left-20 right-20">
        <div className="flex justify-center">
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 mt-16">
              <p className="text-lg font-semibold">Principal/Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Address at Bottom */}
      <div className="absolute bottom-8 left-20 right-20 text-center">
        <p className="text-sm text-gray-700">
          1st Floor Mohsin Market, Yusufpur, Mohammadabad, Uttar Pradesh 233227
        </p>
        <p className="text-sm text-gray-700">
          info@masscom.co.in, +91-9628355656
        </p>
      </div>
    </div>
  );
};

export default CertificatePreview;
