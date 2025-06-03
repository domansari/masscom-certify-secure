
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CertificatePreview from "@/components/CertificatePreview";

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
}

const PrintCertificate = () => {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const searchCertificates = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term to find certificates.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .or(`student_name.ilike.%${searchTerm}%,certificate_id.ilike.%${searchTerm}%,course_name.ilike.%${searchTerm}%,roll_no.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCertificates(data || []);
      
      if (data?.length === 0) {
        toast({
          title: "No Results",
          description: "No certificates found matching your search.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Search Error",
        description: error.message || "Failed to search certificates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    // Small delay to ensure the certificate is rendered before printing
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCertificates();
    }
  };

  if (selectedCertificate) {
    return (
      <div className="print-only">
        <CertificatePreview 
          data={{
            studentName: selectedCertificate.student_name,
            fatherName: selectedCertificate.father_name || "",
            courseName: selectedCertificate.course_name,
            duration: selectedCertificate.duration || "",
            completionDate: selectedCertificate.completion_date,
            grade: selectedCertificate.grade || "",
            studentCoordinator: selectedCertificate.student_coordinator || "",
            certificateId: selectedCertificate.certificate_id,
            rollNo: selectedCertificate.roll_no || "",
          }}
        />
        <div className="no-print fixed top-4 left-4 z-50">
          <Button onClick={() => setSelectedCertificate(null)} variant="outline">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold">Print Certificate</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Search & Print Certificates</CardTitle>
            <CardDescription>
              Search for certificates by student name, certificate ID, course, or roll number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Enter student name, certificate ID, course, or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={searchCertificates} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {certificates.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Certificate ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((certificate) => (
                      <TableRow key={certificate.id}>
                        <TableCell className="font-medium">
                          {certificate.student_name}
                        </TableCell>
                        <TableCell>{certificate.roll_no || "N/A"}</TableCell>
                        <TableCell>{certificate.course_name}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {certificate.certificate_id}
                        </TableCell>
                        <TableCell>
                          {new Date(certificate.completion_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handlePrintCertificate(certificate)}
                            className="flex items-center gap-2"
                          >
                            <Printer className="h-4 w-4" />
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {certificates.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-8">
                <Printer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No certificates to display</p>
                <p className="text-sm">Use the search above to find certificates to print</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrintCertificate;
