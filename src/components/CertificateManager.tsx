
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

type SortField = 'completion_date' | 'course_name' | 'student_name' | 'created_at';
type SortOrder = 'asc' | 'desc';

const CertificateManager = ({ onEditCertificate }: CertificateManagerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const confirmDelete = async () => {
    if (!certificateToDelete) {
      toast({
        title: "Missing Information",
        description: "No certificate selected for deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      console.log('Attempting to delete certificate:', certificateToDelete.id);
      
      // Delete the certificate record
      const { error: deleteError } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateToDelete.id);

      if (deleteError) {
        console.error('Delete error details:', deleteError);
        throw deleteError;
      }

      // Invalidate and refetch the certificates query
      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      
      // Clear the deletion state
      setCertificateToDelete(null);
      setDialogOpen(false);
      
      toast({
        title: "Certificate Deleted",
        description: `Certificate for ${certificateToDelete.student_name} has been permanently deleted.`,
      });
      
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete certificate.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort certificates
  const sortedAndFilteredCertificates = certificates
    .filter(cert =>
      cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.roll_no && cert.roll_no.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case 'completion_date':
          aValue = new Date(a.completion_date);
          bValue = new Date(b.completion_date);
          break;
        case 'course_name':
          aValue = a.course_name.toLowerCase();
          bValue = b.course_name.toLowerCase();
          break;
        case 'student_name':
          aValue = a.student_name.toLowerCase();
          bValue = b.student_name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />;
  };

  if (isLoading) {
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
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by student name, certificate ID, course, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4 items-center">
            <Label htmlFor="sort-field" className="text-sm font-medium">
              Sort by:
            </Label>
            <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Added</SelectItem>
                <SelectItem value="completion_date">Completion Date</SelectItem>
                <SelectItem value="course_name">Course Name</SelectItem>
                <SelectItem value="student_name">Student Name</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2"
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {sortedAndFilteredCertificates.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchTerm ? "No certificates found matching your search." : "No certificates found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('student_name')}
                      className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
                    >
                      Student Name
                      {getSortIcon('student_name')}
                    </Button>
                  </TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('course_name')}
                      className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
                    >
                      Course
                      {getSortIcon('course_name')}
                    </Button>
                  </TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('completion_date')}
                      className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
                    >
                      Completion Date
                      {getSortIcon('completion_date')}
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredCertificates.map((certificate) => (
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog open={dialogOpen && certificateToDelete?.id === certificate.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) {
                            setCertificateToDelete(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCertificateToDelete(certificate);
                                setDialogOpen(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white border border-gray-200 shadow-lg">
                            <DialogHeader>
                              <DialogTitle>Confirm Permanent Deletion</DialogTitle>
                              <DialogDescription>
                                You are about to permanently delete the certificate for <strong>{certificate.student_name}</strong>. 
                                This action cannot be undone. Please confirm by clicking Delete Permanently.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCertificateToDelete(null);
                                  setDialogOpen(false);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete Permanently"
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
