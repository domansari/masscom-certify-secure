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
      <div className="flex justify-center mb-0">
        <img 
          src="/lovable-uploads/62c16412-d87b-42a8-9aa2-0daca4025461.png" 
          alt="Institute Logo" 
          className="h-40 w-40 object-contain"
        />
      </div>

      {/* Institute Name - Reduced margin */}
      <div className="text-center mb-0">
        <h1 className="text-3xl font-bold text-blue-700 uppercase tracking-wide">
          MASSCOM INFOTECH EDUCATION
        </h1>
      </div>

      {/* Subtitle */}
      <div className="text-center mb-0">
        <p className="text-lg text-gray-700 italic">
          [An Autonomous Institution Registered Under The Public Trust Act.]
        </p>
      </div>
    </>
  );
};

export default CertificateHeader;