
import { QrCode } from "lucide-react";

interface CertificateData {
  studentName: string;
  courseName: string;
  duration: string;
  completionDate: string;
  grade: string;
  instructorName: string;
  certificateId: string;
}

interface CertificatePreviewProps {
  data: CertificateData;
}

const CertificatePreview = ({ data }: CertificatePreviewProps) => {
  return (
    <div className="certificate-bg p-8 rounded-lg shadow-lg bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-yellow-400 to-yellow-600 rounded-full translate-x-16 translate-y-16"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <h1 className="text-3xl font-bold text-primary mb-2">
          MASSCOM INFOTECH EDUCATION
        </h1>
        <p className="text-lg text-gray-600 mb-4">Certificate of Completion</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto"></div>
      </div>

      {/* Certificate Content */}
      <div className="text-center mb-8 relative">
        <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
          {data.studentName || "Student Name"}
        </h2>
        <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
        <h3 className="text-2xl font-semibold text-primary mb-4">
          {data.courseName || "Course Name"}
        </h3>
        
        {data.duration && (
          <p className="text-gray-600 mb-2">Duration: {data.duration}</p>
        )}
        
        {data.grade && (
          <p className="text-gray-600 mb-4">Performance: {data.grade}</p>
        )}

        <p className="text-gray-700">
          Completed on: {data.completionDate ? new Date(data.completionDate).toLocaleDateString() : "Date"}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end relative">
        <div className="text-center">
          <div className="w-40 h-px bg-gray-400 mb-2"></div>
          <p className="text-sm text-gray-600">Director</p>
          <p className="text-sm font-medium">Masscom Infotech Education</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
            <QrCode className="h-10 w-10 text-gray-500" />
          </div>
          <p className="text-xs text-gray-500">Scan to verify</p>
        </div>

        <div className="text-center">
          <div className="w-40 h-px bg-gray-400 mb-2"></div>
          <p className="text-sm text-gray-600">Instructor</p>
          <p className="text-sm font-medium">{data.instructorName || "Instructor Name"}</p>
        </div>
      </div>

      {/* Certificate ID */}
      <div className="absolute bottom-4 left-8 text-xs text-gray-500">
        Certificate ID: {data.certificateId || "Generated ID"}
      </div>

      {/* Issue Date */}
      <div className="absolute bottom-4 right-8 text-xs text-gray-500">
        Issued: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default CertificatePreview;
