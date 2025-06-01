
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Certificate {
  id: string;
  certificate_id: string;
  student_name: string;
  course_name: string;
  completion_date: string;
  grade: string | null;
  instructor_name: string | null;
  duration: string | null;
  created_at: string;
}

interface CertificateManagerProps {
  onEditCertificate: (certificate: Certificate) => void;
}

const CertificateManager = ({ onEditCertificate }: CertificateManagerProps) => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCertificates = async (search?: string) => {
    if (!isAdmin()) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`student_name.ilike.%${search}%,certificate_id.ilike.%${search}%,course_name.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setCertificates(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch certificates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSearch = () => {
    fetchCertificates(searchTerm);
  };

  const handleDownloadQR = (certificateId: string, studentName: string) => {
    // This will trigger the QR code download
    const event = new CustomEvent('downloadQR', { 
      detail: { certificateId, studentName } 
    });
    window.dispatchEvent(event);
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Management</CardTitle>
        <CardDescription>
          Search, view, edit, and download previously generated certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Search by student name, certificate ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading certificates...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No certificates found
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-sm">{cert.certificate_id}</TableCell>
                      <TableCell className="font-medium">{cert.student_name}</TableCell>
                      <TableCell>{cert.course_name}</TableCell>
                      <TableCell>{new Date(cert.completion_date).toLocaleDateString()}</TableCell>
                      <TableCell>{cert.grade || "-"}</TableCell>
                      <TableCell>{new Date(cert.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditCertificate(cert)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadQR(cert.certificate_id, cert.student_name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateManager;
