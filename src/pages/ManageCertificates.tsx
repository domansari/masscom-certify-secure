
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditCertificateForm from "@/components/EditCertificateForm";
import { CertificateFilters } from "@/components/manage-certificates/CertificateFilters";
import { CertificateTable } from "@/components/manage-certificates/CertificateTable";
import { DeleteCertificateDialog } from "@/components/manage-certificates/DeleteCertificateDialog";
import { CertificatePagination } from "@/components/manage-certificates/CertificatePagination";

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

const RECORDS_PER_PAGE = 20;

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
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleDeleteCertificate = (certificate: Certificate) => {
    setCertificateToDelete(certificate);
    setDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDialogOpen(false);
    setCertificateToDelete(null);
    setDeletePassword("");
    setDeletePasswordError("");
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

  // Pagination calculations
  const totalPages = Math.ceil(sortedAndFilteredCertificates.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const paginatedCertificates = sortedAndFilteredCertificates.slice(startIndex, endIndex);

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
              <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-200 transition-colors">
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
            <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-200 transition-colors">
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
              View, edit, and delete existing certificates ({sortedAndFilteredCertificates.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CertificateFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              totalRecords={sortedAndFilteredCertificates.length}
              startIndex={startIndex}
              endIndex={endIndex}
            />

            {sortedAndFilteredCertificates.length === 0 ? (
              <div className="text-center text-gray-200 py-8">
                {searchTerm ? "No certificates found matching your search." : "No certificates found."}
              </div>
            ) : (
              <>
                <CertificateTable
                  certificates={paginatedCertificates}
                  onEdit={handleEditCertificate}
                  onDelete={handleDeleteCertificate}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />

                <CertificatePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteCertificateDialog
        isOpen={dialogOpen}
        onClose={handleCloseDeleteDialog}
        certificate={certificateToDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        password={deletePassword}
        setPassword={setDeletePassword}
        passwordError={deletePasswordError}
        setPasswordError={setDeletePasswordError}
      />

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
