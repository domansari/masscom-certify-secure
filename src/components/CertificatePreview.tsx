
import { CertificatePreviewProps } from "@/types/certificate";
import CertificateHeader from "./certificate/CertificateHeader";
import CertificateBody from "./certificate/CertificateBody";
import CertificateFooter from "./certificate/CertificateFooter";
import QRCodeSection from "./certificate/QRCodeSection";

const CertificatePreview = ({ data }: CertificatePreviewProps) => {
  return (
    <div className="relative">
      <div 
        id="certificate-container"
        className="certificate-container relative mx-auto print:mx-0"
        style={{
          width: '210mm',
          height: '297mm',
          transform: 'scale(0.4)',
          transformOrigin: 'top left',
          padding: '0',
          margin: '0',
          fontFamily: 'Times, serif',
          backgroundImage: `url('/lovable-uploads/7ab347ae-d0be-4f64-ae7e-c4bfd0378ac4.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxSizing: 'border-box'
        }}
      >
        <div 
          id="certificate-element"
          className="relative w-full h-full"
          style={{
            width: '210mm',
            height: '297mm',
            padding: '0',
            margin: '0',
            boxSizing: 'border-box'
          }}
        >
          <QRCodeSection certificateId={data.certificateId} />
          
          {/* Main Content Container */}
          <div className="flex flex-col h-full" style={{ padding: '0mm 0mm 0mm 0mm' }}>
            <CertificateHeader data={data} />
            <CertificateBody data={data} />
            <CertificateFooter data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
