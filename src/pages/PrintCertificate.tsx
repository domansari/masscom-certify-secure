
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CertificatePreview from "@/components/CertificatePreview";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface Certificate {
  id: string;
  certificate_id: string;
  student_name: string;
  father_name: string;
  course_name: string;
  duration: string;
  completion_date: string;
  grade: string;
  student_coordinator: string;
  roll_no?: string;
  batch_number?: string;
}

const PrintCertificate = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCertificate(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load certificate.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id, toast]);

  const handlePrint = () => {
    // Add print-specific styles
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        #certificate-container, #certificate-container * {
          visibility: visible;
        }
        #certificate-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform: none !important;
        }
        .no-print {
          display: none !important;
        }
        canvas {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
    
    window.print();
    
    // Remove the style after printing
    setTimeout(() => {
      document.head.removeChild(styleSheet);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/manage" className="flex items-center space-x-3 text-gray-900 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Manage</span>
              </Link>
              <h1 className="text-xl font-semibold">Print Certificate</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading certificate...</div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/manage" className="flex items-center space-x-3 text-gray-900 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Manage</span>
              </Link>
              <h1 className="text-xl font-semibold">Print Certificate</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">Certificate not found.</div>
        </div>
      </div>
    );
  }

  const certificateData = {
    studentName: certificate.student_name,
    fatherName: certificate.father_name || "",
    courseName: certificate.course_name,
    duration: certificate.duration || "",
    completionDate: certificate.completion_date,
    grade: certificate.grade || "",
    studentCoordinator: certificate.student_coordinator || "",
    certificateId: certificate.certificate_id,
    rollNo: certificate.roll_no || "",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/manage" className="flex items-center space-x-3 text-gray-900 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Manage</span>
            </Link>
            <h1 className="text-xl font-semibold">Print Certificate</h1>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Certificate Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="no-print">
                <CardTitle>Certificate Preview</CardTitle>
                <CardDescription>
                  Certificate for {certificate.student_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={certificateRef}>
                  <CertificatePreview data={certificateData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code and Details */}
          <div className="space-y-6 no-print">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>
                  QR code for certificate verification
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodeGenerator
                  data={`${window.location.origin}/verify?id=${certificate.certificate_id}`}
                  filename={`${certificate.student_name.replace(/\s+/g, '_')}_${certificate.certificate_id}`}
                  size={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Student:</strong> {certificate.student_name}</div>
                <div><strong>Course:</strong> {certificate.course_name}</div>
                <div><strong>Completion Date:</strong> {new Date(certificate.completion_date).toLocaleDateString()}</div>
                {certificate.roll_no && <div><strong>Roll No:</strong> {certificate.roll_no}</div>}
                {certificate.batch_number && <div><strong>Batch:</strong> {certificate.batch_number}</div>}
                <div><strong>Certificate ID:</strong> {certificate.certificate_id}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintCertificate;
