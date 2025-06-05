
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
    <div className="relative">
      <div 
        id="certificate-element"
        className="certificate-container relative mx-auto print:mx-0"
        style={{
          width: '210mm',
          height: '297mm',
          transform: 'scale(0.4)',
          transformOrigin: 'top left',
          padding: '0',
          margin: '0',
          fontFamily: 'Times, serif',
          backgroundImage: `url('/lovable-uploads/f0d1378d-119b-4fea-80f3-ead49ffa08f1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
        <div className="flex flex-col h-full" style={{ padding: '1mm 1mm 1mm 1mm' }}>
          {/* Logo and Institute Name - Reduced Gap */}
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/62c16412-d87b-42a8-9aa2-0daca4025461.png" 
              alt="Institute Logo" 
              className="h-40 w-40 object-contain"
            />
          </div>

          {/* Institute Name - Reduced margin */}
          <div className="text-center mb-3">
            <h1 className="text-3xl font-bold text-blue-700 uppercase tracking-wide">
              MASSCOM INFOTECH EDUCATION
            </h1>
          </div>

          {/* Subtitle */}
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700 italic">
              [An Autonomous Institution Registered Under The Public Trust Act.]
            </p>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-4">
            <h2 className="text-6xl font-bold italic tracking-widest mb-2" style={{ color: '#FFD700' }}>
              Certificate
            </h2>
            <p className="text-2xl text-gray-800 mt-2">of Achievement, This is to certify that</p>
          </div>

          {/* Student Name */}
          <div className="text-center mb-4">
            <h3 className="text-3xl font-bold text-black uppercase mb-2">
              {data.studentName || "Student Name"}
            </h3>
            <div>
              <div 
                className="mx-auto border-b-2 border-black"
                style={{ 
                  width: `${Math.max(200, (data.studentName?.length || 12) * 18)}px`
                }}
              >
              </div>
            </div>
          </div>

          {/* S/O, D/O and Roll No - Centered with equal gaps */}
          <div className="flex justify-center items-center gap-16 mb-4">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">S/O, D/O:</p>
              <div 
                className="border-b border-black pb-1 mx-auto"
                style={{ 
                  width: `${Math.max(150, (data.fatherName?.length || 10) * 14)}px`
                }}
              >
                <p className="text-xl font-semibold text-center">{data.fatherName || "Father's Name"}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">Roll No:</p>
              <div 
                className="border-b border-black pb-1 mx-auto"
                style={{ 
                  width: `${Math.max(120, (data.rollNo?.length || 8) * 16)}px`
                }}
              >
                <p className="text-xl font-semibold text-center">{data.rollNo || "Roll Number"}</p>
              </div>
            </div>
          </div>

          <p className="text-2xl text-gray-800 text-center mb-4">
            has successfully completed the course of
          </p>

          {/* Seal Image - Center aligned above course name */}
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/dc9bc102-52f2-4cb0-ae96-01e99ea9fc4f.png" 
              alt="Official Seal" 
              className="h-32 w-32 object-contain"
            />
          </div>

          {/* Course Name */}
          <div className="border-b-2 border-black pb-2 mx-20 mb-4">
            <h4 className="text-2xl font-bold text-black text-center">
              {data.courseName || "Course Name"}
            </h4>
          </div>

          {/* Duration, Grade, and Date in one row */}
          <div className="flex justify-center items-center gap-12 mb-4">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">Duration:</p>
              <div className="border-b border-black pb-1">
                <p className="text-xl font-semibold">
                  {data.duration ? `${data.duration}` : "Duration"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">Grade:</p>
              <div className="border-b border-black pb-1">
                <p className="text-xl font-semibold">{data.grade || "Grade"}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">Date of Issue:</p>
              <div className="border-b border-black pb-1">
                <p className="text-xl font-semibold">
                  {data.completionDate ? new Date(data.completionDate).toLocaleDateString() : "Date"}
                </p>
              </div>
            </div>
          </div>

          {/* Signatures Section - Proper space above */}
          <div className="mt-8 mb-1">
            <div className="flex justify-between items-end max-w-4xl mx-auto">
              <div className="text-center flex-1 mx-8">
                <div className="border-t-2 border-black pt-2 mt-8">
                  <p className="text-sm text-gray-600 mb-1">
                    {data.studentCoordinator || "Co-ordinator Name"}
                  </p>
                  <p className="text-lg font-bold">Student Co-ordinator</p>
                </div>
              </div>
              <div className="text-center flex-1 mx-8">
                <div className="border-t-2 border-black pt-2 mt-8">
                  <p className="text-sm text-gray-600 mb-1">
                    Akbar Ansari
                  </p>
                  <p className="text-lg font-bold">Principal/Director</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address and Contact Info at Bottom */}
          <div className="text-center mt-1 mb-1">
            <p className="text-sm text-gray-700">
              1st Floor Mohsin Market, Yusufpur,Mohammadabad, Uttar Pradesh-India 233227
            </p>
            <p className="text-sm text-gray-700">
              info@masscom.co.in, +91-9628355656
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
