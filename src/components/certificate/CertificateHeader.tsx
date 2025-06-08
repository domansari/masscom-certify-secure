
import { CertificateData } from "@/types/certificate";

interface CertificateHeaderProps {
  data: CertificateData;
}

const CertificateHeader = ({ data }: CertificateHeaderProps) => {
  return (
    <>
      {/* Certificate ID - Extreme Left Top Corner */}
      <div className="absolute top-2 left-4 text-sm font-bold text-black z-10">
        Certificate ID: {data.certificateId || "Generated ID"}
      </div>

      {/* Logo and Institute Name - Reduced Gap */}
     <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
      <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
<div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
      <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
       <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
<div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
       <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
      {/* Subtitle */}
      <div className="text-center mb-5">
        <p className="text-lg italic text-black-600">
          [An Autonomous Institution Registered Under The Public Trust Act.]
        </p>
      </div>
    </>
  );
};

export default CertificateHeader;
