
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  created_at: string;
}

interface CertificateManagerProps {
  onEditCertificate: (certificate: Certificate) => void;
}

const CertificateManager = ({ onEditCertificate }: CertificateManagerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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

  const confirmDelete = async () => {
    if (!certificateToDelete || !deletePassword) {
      toast({
        title: "Missing Information",
        description: "Please enter your admin password to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      // Verify admin password by attempting to sign in
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: deletePassword
      });

      if (authError) {
        toast({
          title: "Authentication Failed",
          description: "Incorrect password. Deletion cancelled.",
          variant: "destructive",
        });
        setIsDeleting(false);
        return;
      }

      // If password is correct, proceed with deletion
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateToDelete.id);

      if (error) throw error;

      setCertificates(certificates.filter(cert => cert.id !== certificateToDelete.id));
      setCertificateToDelete(null);
      setDeletePassword("");
      
      toast({
        title: "Certificate Deleted",
        description: "The certificate has been permanently deleted from the database.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete certificate.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert =>
    cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.roll_no && cert.roll_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Certificates</CardTitle>
          <CardDescription>Loading certificates...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Certificates</CardTitle>
        <CardDescription>
          View, edit, and delete existing certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <ArrowUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by student name, certificate ID, course, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCertificates.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchTerm ? "No certificates found matching your search." : "No certificates found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((certificate) => (
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
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditCertificate(certificate)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCertificateToDelete(certificate)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                You are about to permanently delete the certificate for <strong>{certificate.student_name}</strong>. 
                                This action cannot be undone. Please enter your admin password to confirm.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="password">Admin Password</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  value={deletePassword}
                                  onChange={(e) => setDeletePassword(e.target.value)}
                                  placeholder="Enter your admin password"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCertificateToDelete(null);
                                  setDeletePassword("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={isDeleting || !deletePassword}
                              >
                                {isDeleting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete Certificate"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateManager;
