
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
            width: 80,
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
      id="certificate-element"
      className="certificate-container relative bg-white mx-auto print:mx-0"
      style={{
        width: '210mm',
        height: '297mm',
        transform: 'scale(0.4)',
        transformOrigin: 'top left',
        padding: '0',
        margin: '0',
        fontFamily: 'Times, serif',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '12px solid transparent',
        borderImage: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3) 1',
        boxSizing: 'border-box'
      }}
    >
      {/* Certificate ID - Extreme Left Top Corner */}
      <div className="absolute top-4 left-4 text-sm font-bold text-black z-10">
        Certificate ID: {data.certificateId || "Generated ID"}
      </div>

      {/* QR Code - Extreme Right Top Corner */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white border border-gray-300 rounded flex items-center justify-center z-10">
        <canvas ref={qrCanvasRef} className="w-full h-full" />
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col h-full" style={{ padding: '15mm 15mm 5mm 15mm' }}>
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/945d2cdf-b885-4e7f-bc56-dc8153f8bc7d.png" 
            alt="Institute Logo" 
            className="h-28 w-auto object-contain"
          />
        </div>

        {/* Institute Name - Single Line */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-wide">
            MASSCOM INFOTECH EDUCATION
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700 italic">
            [An Autonomous Institution Registered Under The Public Trust Act.]
          </p>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-red-600 uppercase tracking-widest">
            CERTIFICATE
          </h2>
          <p className="text-xl text-gray-700 mt-2">Of Achievement</p>
        </div>

        {/* Certificate Content */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <p className="text-xl text-gray-800 text-center">
            This is to certify that
          </p>
          
          <div className="text-center">
            <h3 className="text-3xl font-bold text-black uppercase mb-2">
              {data.studentName || "Student Name"}
            </h3>
            <div 
              className="mx-auto border-b-2 border-black"
              style={{ 
                width: `${Math.max(200, (data.studentName?.length || 12) * 20)}px`
              }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div>
              <p className="text-lg text-gray-700 mb-1">S/O, D/O:</p>
              <div 
                className="border-b border-black pb-1"
                style={{ 
                  width: `${Math.max(150, (data.fatherName?.length || 10) * 16)}px`
                }}
              >
                <p className="text-xl font-semibold">{data.fatherName || "Father's Name"}</p>
              </div>
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-1">Roll No:</p>
              <div 
                className="border-b border-black pb-1"
                style={{ 
                  width: `${Math.max(120, (data.rollNo?.length || 8) * 18)}px`
                }}
              >
                <p className="text-xl font-semibold">{data.rollNo || "Roll Number"}</p>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-800 text-center">
            has successfully completed the course of
          </p>

          <div className="border-b-2 border-black pb-2 mx-20">
            <h4 className="text-2xl font-bold text-black text-center">
              {data.courseName || "Course Name"}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div>
              <p className="text-lg text-gray-700 mb-1">Duration:</p>
              <div className="border-b border-black pb-1">
                <p className="text-xl font-semibold">
                  {data.duration ? `${data.duration} Months` : "Duration"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-1">Grade:</p>
              <div className="border-b border-black pb-1">
                <p className="text-xl font-semibold">{data.grade || "Grade"}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 mb-1">Date of Issue:</p>
            <div className="inline-block">
              <p className="text-xl font-semibold mb-1">
                {data.completionDate ? new Date(data.completionDate).toLocaleDateString() : "Date"}
              </p>
              <div 
                className="border-b border-black mx-auto"
                style={{ 
                  width: `${Math.max(120, (data.completionDate ? new Date(data.completionDate).toLocaleDateString().length : 8) * 12)}px`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Signatures Section - Reduced space */}
        <div className="mt-2 mb-1">
          <div className="flex justify-between items-end max-w-3xl mx-auto">
            <div className="text-center flex-1 mx-6">
              <div className="border-t-2 border-black pt-2 mt-8">
                <p className="text-lg font-bold">Principal/Director</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email and Mobile at Bottom - Inside border with reduced margin */}
        <div className="text-center mt-1 mb-1">
          <p className="text-sm text-gray-700">
            info@masscom.co.in, +91-9628355656
          </p>
          <p className="text-sm text-gray-700">
            1st Floor Mohsin Market, Yusufpur, Mohammadabad, Uttar Pradesh 233227
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
