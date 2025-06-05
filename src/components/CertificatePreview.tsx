
import { CertificatePreviewProps } from "@/types/certificate";
import CertificateHeader from "./certificate/CertificateHeader";
import CertificateBody from "./certificate/CertificateBody";
import CertificateFooter from "./certificate/CertificateFooter";
import QRCodeSection from "./certificate/QRCodeSection";

const CertificatePreview = ({ data }: CertificatePreviewProps) => {
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
          backgroundImage: `url('public/lovable-uploads/axa.png')`,
         
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxSizing: 'border-box'
        }}
      >
        <QRCodeSection certificateId={data.certificateId} />
        
        {/* Main Content Container */}
        <div className="flex flex-col h-full" style={{ padding: '1mm 1mm 1mm 1mm' }}>
          <CertificateHeader data={data} />
          <CertificateBody data={data} />
          <CertificateFooter data={data} />
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
