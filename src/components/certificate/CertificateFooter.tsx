import { CertificateData } from "@/types/certificate";

interface CertificateFooterProps {
  data: CertificateData;
}

const CertificateFooter = ({ data }: CertificateFooterProps) => {
  return (
    <>
      {/* Signatures Section - Proper space above */}
      <div className="mt-6 mb-1">
        <div className="flex justify-between items-end max-w-4xl mx-auto">
          <div className="text-center flex-1 mx-12">
            <div className="border-t-2 border-black pt-3 mt-4">
              <p className="text-sm text-black-800 mb-1">
                {data.studentCoordinator || "Co-ordinator Name"}
              </p>
              <p className="text-lg font-bold">Student Co-ordinator</p>
            </div>
          </div>
          <div className="text-center flex-1 mx-12">
            <div className="border-t-2 border-black pt-3 mt-8">
              <p className="text-sm text-black-800 mb-1">
                Akbar Ansari
              </p>
              <p className="text-lg font-bold">Principal/Director</p>
            </div>
     
          </div>
        </div>
      </div>

             {/* Address and Contact Info at Bottom */}
      <div className="text-center mt-2 mb-1">
        <p className="text-sm text-black-700">
          1st Floor Mohsin Market,Yusufpur,Mohammadabad,Ghazipur(U.P.)233227.</p> 
        <p className="text-sm text-black-700">Email:info@masscom.co.in,Mobile:+91-9628355656,www.masscom.co.in
        </p>
      
      </div>
    </>
  );
};

export default CertificateFooter;
