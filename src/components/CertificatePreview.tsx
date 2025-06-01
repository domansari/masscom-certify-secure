
import { QrCode } from "lucide-react";

interface CertificateData {
  studentName: string;
  fatherName: string;
  courseName: string;
  duration: string;
  completionDate: string;
  grade: string;
  studentCoordinator: string;
  certificateId: string;
}

interface CertificatePreviewProps {
  data: CertificateData;
}

const CertificatePreview = ({ data }: CertificatePreviewProps) => {
  return (
    <div 
      className="certificate-container relative overflow-hidden bg-white shadow-lg"
      style={{
        width: '297mm',
        height: '210mm',
        backgroundImage: 'url(/lovable-uploads/6bb1665e-2bc0-4761-a747-55431e93f784.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: 'scale(0.3)',
        transformOrigin: 'top left',
        margin: '0 auto'
      }}
    >
      {/* Certificate ID - Extreme Left Top Corner */}
      <div className="absolute top-4 left-4 text-sm font-bold text-black bg-white bg-opacity-80 px-2 py-1 rounded">
        Certificate ID: {data.certificateId || "Generated ID"}
      </div>

      {/* QR Code - Extreme Right Top Corner */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-90 rounded flex items-center justify-center">
        <QrCode className="h-16 w-16 text-gray-700" />
      </div>

      {/* Header with Institution Name */}
      <div className="absolute top-16 left-8 right-8 text-center">
        <h1 className="text-5xl font-bold text-blue-800 mb-2">
          MASSCOM INFOTECH EDUCATION
        </h1>
        <p className="text-xl text-gray-800 mb-4">[An Autonomous institution registered under Public Trust Act.]</p>
      </div>

      {/* Certificate Content */}
      <div className="absolute top-36 left-8 right-8 text-center">
        <p className="text-3xl text-black mb-8 font-serif italic">
          This Certificate is Awarded to M.R./M.S.
        </p>
        
        <div className="border-b-2 border-black pb-2 mb-6 mx-16">
          <h2 className="text-4xl font-bold text-black">
            {data.studentName || "Student Name"}
          </h2>
        </div>

        <div className="border-b-2 border-black pb-2 mb-8 mx-20">
          <p className="text-2xl text-black">
            S/O, D/O: {data.fatherName || "Father's Name"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="border-b border-black pb-1 mb-2">
              <p className="text-xl text-black">{data.courseName || "Course Name"}</p>
            </div>
            <p className="text-lg text-black">Course</p>
          </div>
          <div>
            <p className="text-xl text-black">on Successful Completion of the</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="border-b border-black pb-1 mb-2">
              <p className="text-xl text-black">{data.duration || "Duration"}</p>
            </div>
            <p className="text-lg text-black">Yusufpur Uttar Pradesh of Duration</p>
          </div>
          <div>
            <div className="border-b border-black pb-1 mb-2">
              <p className="text-xl text-black">{data.grade || "Grade"}</p>
            </div>
            <p className="text-lg text-black">and has procured the Grade</p>
          </div>
        </div>

        <p className="text-2xl text-black mb-8">at Masscom InfoTech Education</p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-16 left-8 right-8">
        <div className="grid grid-cols-3 gap-8 items-end">
          <div className="text-center">
            <div className="border-t-2 border-red-600 pt-2">
              <p className="text-lg font-semibold text-black">
                {data.studentCoordinator || "Student Co-ordinator"}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="border-t-2 border-red-600 pt-2">
              <p className="text-lg font-semibold text-black">
                Date of Issue: {data.completionDate ? new Date(data.completionDate).toLocaleDateString() : "Date"}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="border-t-2 border-red-600 pt-2">
              <p className="text-lg font-semibold text-black">Managing Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Address */}
      <div className="absolute bottom-4 left-8 right-8 text-center">
        <p className="text-sm text-black">
          1st Floor Mohsin Market, Yusufpur Mohammadabad Ghazipur-233227, info@masscom.co.in, +91-9628355656
        </p>
      </div>
    </div>
  );
};

export default CertificatePreview;
