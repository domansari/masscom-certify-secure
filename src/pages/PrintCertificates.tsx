
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ArrowUpDown, Download, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { generateCertificatePDF } from "@/utils/pdfGenerator";
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
  batch_number?: string;
  created_at: string;
}

type SortField = 'completion_date' | 'course_name' | 'student_name' | 'created_at' | 'batch_number';
type SortOrder = 'asc' | 'desc';

const PrintCertificates = () => {
  const { toast } = useToast();
  const certificateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedCertificates, setSelectedCertificates] = useState<Set<string>>(new Set());
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [isPrintingBatch, setIsPrintingBatch] = useState(false);
  const [isPrintingSelected, setIsPrintingSelected] = useState(false);

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

  const handlePrintSelected = async () => {
    if (selectedCertificates.size === 0) {
      toast({
        title: "No Certificates Selected",
        description: "Please select at least one certificate to print.",
        variant: "destructive",
      });
      return;
    }

    setIsPrintingSelected(true);
    const selectedCerts = certificates.filter(cert => selectedCertificates.has(cert.id));
    
    try {
      const container = document.createElement('div');
      
      for (const certificate of selectedCerts) {
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

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = `
          <div style="page-break-after: always; width: 210mm; height: 297mm; position: relative; font-family: Times, serif; background-image: url('/lovable-uploads/7ab347ae-d0be-4f64-ae7e-c4bfd0378ac4.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
            <!-- Certificate content would be rendered here -->
          </div>
        `;
        
        container.appendChild(tempContainer);
      }

      const filename = `Selected_Certificates_${new Date().getTime()}`;
      await generateCertificatePDF(container, filename);
      
      toast({
        title: "Download Complete",
        description: `Downloaded ${selectedCerts.length} selected certificates.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPrintingSelected(false);
    }
  };

  const handlePrintBatch = async () => {
    if (!selectedBatch) {
      toast({
        title: "No Batch Selected",
        description: "Please select a batch to print.",
        variant: "destructive",
      });
      return;
    }

    setIsPrintingBatch(true);
    const batchCertificates = sortedAndFilteredCertificates.filter(cert => cert.batch_number === selectedBatch);
    
    try {
      const batchContainer = document.createElement('div');
      
      for (const certificate of batchCertificates) {
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

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = `
          <div style="page-break-after: always; width: 210mm; height: 297mm; position: relative; font-family: Times, serif; background-image: url('/lovable-uploads/7ab347ae-d0be-4f64-ae7e-c4bfd0378ac4.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
            <!-- Certificate content would be rendered here -->
          </div>
        `;
        
        batchContainer.appendChild(tempContainer);
      }

      const filename = `Batch_${selectedBatch}`;
      await generateCertificatePDF(batchContainer, filename);
      
      toast({
        title: "Batch Download Complete",
        description: `Downloaded ${batchCertificates.length} certificates for batch ${selectedBatch}.`,
      });
    } catch (error) {
      toast({
        title: "Batch Download Failed",
        description: "Failed to generate batch PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPrintingBatch(false);
    }
  };

  const toggleCertificateSelection = (certificateId: string) => {
    const newSelected = new Set(selectedCertificates);
    if (newSelected.has(certificateId)) {
      newSelected.delete(certificateId);
    } else {
      newSelected.add(certificateId);
    }
    setSelectedCertificates(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCertificates.size === sortedAndFilteredCertificates.length) {
      setSelectedCertificates(new Set());
    } else {
      setSelectedCertificates(new Set(sortedAndFilteredCertificates.map(cert => cert.id)));
    }
  };

  // Get unique batch numbers
  const uniqueBatches = Array.from(new Set(certificates.filter(cert => cert.batch_number).map(cert => cert.batch_number))).sort();

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
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-xl font-semibold">Print Certificates</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Print Certificates</CardTitle>
              <CardDescription>Loading certificates...</CardDescription>
            </CardHeader>
          </Card>
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
            <h1 className="text-xl font-semibold">Print Certificates</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Print Certificates</CardTitle>
            <CardDescription>
              Select individual certificates or entire batches to print and download
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
                  className="pl-10"
                />
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex gap-2 items-center">
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
                      <SelectItem value="batch_number">Batch Number</SelectItem>
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

                <div className="flex gap-2 items-center">
                  <Button
                    onClick={handlePrintSelected}
                    disabled={selectedCertificates.size === 0 || isPrintingSelected}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isPrintingSelected ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Printing...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Print Selected ({selectedCertificates.size})
                      </>
                    )}
                  </Button>
                </div>

                {uniqueBatches.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <Label className="text-sm font-medium">Batch Print:</Label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueBatches.map((batch) => (
                          <SelectItem key={batch} value={batch!}>
                            {batch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handlePrintBatch}
                      disabled={!selectedBatch || isPrintingBatch}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {isPrintingBatch ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Printing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Print Batch
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCertificates.size === sortedAndFilteredCertificates.length && sortedAndFilteredCertificates.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
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
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('batch_number')}
                          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
                        >
                          Batch
                          {getSortIcon('batch_number')}
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
                        <TableCell>
                          <Checkbox
                            checked={selectedCertificates.has(certificate.id)}
                            onCheckedChange={() => toggleCertificateSelection(certificate.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {certificate.student_name}
                        </TableCell>
                        <TableCell>{certificate.roll_no || "N/A"}</TableCell>
                        <TableCell>{certificate.course_name}</TableCell>
                        <TableCell>{certificate.batch_number || "N/A"}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {certificate.certificate_id}
                        </TableCell>
                        <TableCell>
                          {new Date(certificate.completion_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Link to={`/print/${certificate.id}`}>
                            <Button size="sm" variant="outline">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </Link>
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
    </div>
  );
};

export default PrintCertificates;
