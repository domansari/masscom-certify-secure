
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Edit, Trash2, ArrowUpDown, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CertificatePreview from "@/components/CertificatePreview";
import EditCertificateForm from "@/components/EditCertificateForm";

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
  created_at: string;
}

type SortField = 'completion_date' | 'course_name' | 'student_name' | 'created_at' | 'batch_number';
type SortOrder = 'asc' | 'desc';

const ManageCertificates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");

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

    if (deletePassword !== "9565526767") {
      setDeletePasswordError("Incorrect master password");
      return;
    }

    setIsDeleting(true);
    
    try {
      const { error: deleteError } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateToDelete.id);

      if (deleteError) throw deleteError;

      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      
      setCertificateToDelete(null);
      setDialogOpen(false);
      setDeletePassword("");
      setDeletePasswordError("");
      
      toast({
        title: "Certificate Deleted",
        description: `Certificate for ${certificateToDelete.student_name} has been permanently deleted.`,
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

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setEditDialogOpen(true);
  };

  const handleUpdateCertificate = async (updatedData: any) => {
    if (!editingCertificate) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .update(updatedData)
        .eq('id', editingCertificate.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      setEditDialogOpen(false);
      setEditingCertificate(null);

      toast({
        title: "Certificate Updated",
        description: "Certificate has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update certificate.",
        variant: "destructive",
      });
    }
  };

  // Filter and sort certificates
  const sortedAndFilteredCertificates = certificates
    .filter(cert =>
      cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.roll_no && cert.roll_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cert.batch_number && cert.batch_number.toLowerCase().includes(searchTerm.toLowerCase()))
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
        case 'batch_number':
          aValue = (a.batch_number || '').toLowerCase();
          bValue = (b.batch_number || '').toLowerCase();
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
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url('/lovable-uploads/1c1f036d-97eb-4825-9766-e1ddb31b3f55.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <nav className="relative z-10 bg-white/10 backdrop-blur-lg shadow-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-200">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-xl font-semibold text-white">Manage Certificates</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Manage Certificates</CardTitle>
              <CardDescription className="text-gray-200">Loading certificates...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('/lovable-uploads/1c1f036d-97eb-4825-9766-e1ddb31b3f55.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <nav className="relative z-10 bg-white/10 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-200">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold text-white">Manage Certificates</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Manage Certificates</CardTitle>
            <CardDescription className="text-gray-200">
              View, edit, and delete existing certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by student name, certificate ID, course, roll number, or batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex gap-2 items-center">
                  <Label htmlFor="sort-field" className="text-sm font-medium text-white">
                    Sort by:
                  </Label>
                  <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                    <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date Added</SelectItem>
                      <SelectItem value="completion_date">Completion Date</SelectItem>
                      <SelectItem value="course_name">Course Name</SelectItem>
                      <SelectItem value="student_name">Student Name</SelectItem>
                      <SelectItem value="batch_number">Batch Number</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10"
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {sortedAndFilteredCertificates.length === 0 ? (
              <div className="text-center text-gray-200 py-8">
                {searchTerm ? "No certificates found matching your search." : "No certificates found."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('student_name')}
                          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
                        >
                          Student Name
                          {getSortIcon('student_name')}
                        </Button>
                      </TableHead>
                      <TableHead className="text-white">Roll No</TableHead>
                      <TableHead className="text-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('course_name')}
                          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
                        >
                          Course
                          {getSortIcon('course_name')}
                        </Button>
                      </TableHead>
                      <TableHead className="text-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('batch_number')}
                          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
                        >
                          Batch
                          {getSortIcon('batch_number')}
                        </Button>
                      </TableHead>
                      <TableHead className="text-white">Certificate ID</TableHead>
                      <TableHead className="text-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('completion_date')}
                          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
                        >
                          Completion Date
                          {getSortIcon('completion_date')}
                        </Button>
                      </TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredCertificates.map((certificate) => (
                      <TableRow key={certificate.id} className="border-white/20">
                        <TableCell className="font-medium text-white">
                          {certificate.student_name}
                        </TableCell>
                        <TableCell className="text-gray-200">{certificate.roll_no || "N/A"}</TableCell>
                        <TableCell className="text-gray-200">{certificate.course_name}</TableCell>
                        <TableCell className="text-gray-200">{certificate.batch_number || "N/A"}</TableCell>
                        <TableCell className="font-mono text-xs text-gray-200">
                          {certificate.certificate_id}
                        </TableCell>
                        <TableCell className="text-gray-200">
                          {new Date(certificate.completion_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCertificate(certificate)}
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Link to={`/print/${certificate.id}`}>
                              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Dialog open={dialogOpen && certificateToDelete?.id === certificate.id} onOpenChange={(open) => {
                              setDialogOpen(open);
                              if (!open) {
                                setCertificateToDelete(null);
                                setDeletePassword("");
                                setDeletePasswordError("");
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
                                  className="text-red-400 hover:text-red-300 border-red-400/50 hover:bg-red-400/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white border border-gray-200 shadow-lg">
                                <DialogHeader>
                                  <DialogTitle>Confirm Permanent Deletion</DialogTitle>
                                  <DialogDescription>
                                    You are about to permanently delete the certificate for <strong>{certificate.student_name}</strong>. 
                                    This action cannot be undone. Please enter the master password to confirm.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <Label htmlFor="delete-password">Master Password</Label>
                                  <Input
                                    id="delete-password"
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => {
                                      setDeletePassword(e.target.value);
                                      setDeletePasswordError("");
                                    }}
                                    placeholder="Enter master password"
                                  />
                                  {deletePasswordError && (
                                    <p className="text-sm text-red-600">{deletePasswordError}</p>
                                  )}
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setCertificateToDelete(null);
                                      setDialogOpen(false);
                                      setDeletePassword("");
                                      setDeletePasswordError("");
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
      </div>

      {/* Edit Certificate Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Certificate</DialogTitle>
            <DialogDescription>
              Update the certificate information below.
            </DialogDescription>
          </DialogHeader>
          {editingCertificate && (
            <EditCertificateForm
              certificate={editingCertificate}
              onUpdate={handleUpdateCertificate}
              onCancel={() => {
                setEditDialogOpen(false);
                setEditingCertificate(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCertificates;
