
import { CertificateData } from "@/types/certificate";

interface CertificateHeaderProps {
  data: CertificateData;
}

const CertificateHeader = ({ data }: CertificateHeaderProps) => {
  return (
    <>
      {/* Certificate ID - Extreme Left Top Corner */}
      <div className="absolute top-4 left-4 text-sm font-bold text-black z-10">
        Certificate ID: {data.certificateId || "Generated ID"}
      </div>

      {/* Logo and Institute Name - Reduced Gap */}
      <div className="flex justify-center mb-4">
        <p className="text-4xl font-bold text-black">.</p>
         {{}}
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
