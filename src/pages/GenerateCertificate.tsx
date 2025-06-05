
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CertificatePreview from "@/components/CertificatePreview";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import CertificateManager from "@/components/CertificateManager";
import { generateCertificatePDF } from "@/utils/pdfGenerator";

const GenerateCertificate = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    courseName: "",
    duration: "",
    completionDate: "",
    grade: "",
    studentCoordinator: "",
    certificateId: "",
    rollNo: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);

  // Course duration mapping
  const courseDurations = {
    "Diploma in Computer Application": "8 Months",
    "Advance Diploma in Computer Application": "12 Months",
    "Certificate Course in Accountancy(Tally ERP)": "4 Months",
    "Certificate Course in Desktop Publishing": "4 Months"
  };

  // Auto-fill duration when course is selected
  useEffect(() => {
    if (formData.courseName && courseDurations[formData.courseName as keyof typeof courseDurations]) {
      setFormData(prev => ({
        ...prev,
        duration: courseDurations[formData.courseName as keyof typeof courseDurations]
      }));
    }
  }, [formData.courseName]);

  const generateCertificateId = () => {
    const id = `MIE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
    setFormData({ ...formData, certificateId: id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.courseName || !formData.completionDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.certificateId) {
      generateCertificateId();
    }

    setSaving(true);

    try {
      const verificationUrl = `${window.location.origin}/verify?id=${formData.certificateId}`;
      
      if (editingCertificate) {
        // Update existing certificate
        const updateData: any = {
          student_name: formData.studentName,
          father_name: formData.fatherName,
          course_name: formData.courseName,
          duration: formData.duration || null,
          completion_date: formData.completionDate,
          grade: formData.grade || null,
          student_coordinator: formData.studentCoordinator || null,
          qr_code_data: verificationUrl,
          updated_at: new Date().toISOString(),
        };

        // Only add roll_no if the field exists in the database
        if (formData.rollNo) {
          updateData.roll_no = formData.rollNo;
        }

        const { error } = await supabase
          .from('certificates')
          .update(updateData)
          .eq('id', editingCertificate.id);

        if (error) throw error;
        
        toast({
          title: "Certificate Updated!",
          description: "The certificate has been updated successfully.",
        });
      } else {
        // Create new certificate
        const insertData: any = {
          certificate_id: formData.certificateId,
          student_name: formData.studentName,
          father_name: formData.fatherName,
          course_name: formData.courseName,
          duration: formData.duration || null,
          completion_date: formData.completionDate,
          grade: formData.grade || null,
          student_coordinator: formData.studentCoordinator || null,
          qr_code_data: verificationUrl,
          created_by: user?.id,
        };

        // Only add roll_no if the field exists in the database
        if (formData.rollNo) {
          insertData.roll_no = formData.rollNo;
        }

        const { error } = await supabase
          .from('certificates')
          .insert(insertData);

        if (error) throw error;
        
        toast({
          title: "Certificate Generated!",
          description: "Your certificate has been generated and saved successfully.",
        });
      }

      setShowPreview(true);
      setSaved(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save certificate.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) {
      toast({
        title: "Error",
        description: "Certificate preview not available for download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const filename = `${formData.studentName.replace(/\s+/g, '_')}_${formData.certificateId}_Certificate`;
      await generateCertificatePDF(certificateRef.current, filename);
      
      toast({
        title: "Download Complete",
        description: "Your certificate PDF has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      fatherName: "",
      courseName: "",
      duration: "",
      completionDate: "",
      grade: "",
      studentCoordinator: "",
      certificateId: "",
      rollNo: "",
    });
    setShowPreview(false);
    setSaved(false);
    setEditingCertificate(null);
  };

  const handleEditCertificate = (certificate: any) => {
    setFormData({
      studentName: certificate.student_name,
      fatherName: certificate.father_name || "",
      courseName: certificate.course_name,
      duration: certificate.duration || "",
      completionDate: certificate.completion_date,
      grade: certificate.grade || "",
      studentCoordinator: certificate.student_coordinator || "",
      certificateId: certificate.certificate_id,
      rollNo: certificate.roll_no || "",
    });
    setEditingCertificate(certificate);
    setShowPreview(true);
    setSaved(false);
  };

  // Listen for QR download events
  useState(() => {
    const handleQRDownload = (event: any) => {
      const { certificateId, studentName } = event.detail;
      // Create QR code download
      const verificationUrl = `${window.location.origin}/verify?id=${certificateId}`;
      const qrGenerator = document.createElement('div');
      qrGenerator.innerHTML = `<canvas></canvas>`;
      // This would trigger the QR code generation and download
    };

    window.addEventListener('downloadQR', handleQRDownload);
    return () => window.removeEventListener('downloadQR', handleQRDownload);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold">Generate Certificate</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Certificate Management Section */}
        <div className="mb-8">
          <CertificateManager onEditCertificate={handleEditCertificate} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCertificate ? "Edit Certificate" : "Certificate Details"}
              </CardTitle>
              <CardDescription>
                {editingCertificate 
                  ? "Update the certificate information"
                  : "Fill in the student and course information to generate a certificate"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Enter student's full name"
                    required
                    disabled={saved && !editingCertificate}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      placeholder="Enter father's full name"
                      required
                      disabled={saved && !editingCertificate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll No.</Label>
                    <Input
                      id="rollNo"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      placeholder="Enter roll number"
                      disabled={saved && !editingCertificate}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Select 
                    value={formData.courseName} 
                    onValueChange={(value) => setFormData({ ...formData, courseName: value })} 
                    disabled={saved && !editingCertificate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diploma in Computer Application">Diploma in Computer Application</SelectItem>
                      <SelectItem value="Advance Diploma in Computer Application">Advance Diploma in Computer Application</SelectItem>
                      <SelectItem value="Certificate Course in Accountancy(Tally ERP)">Certificate Course in Accountancy(Tally ERP)</SelectItem>
                      <SelectItem value="Certificate Course in Desktop Publishing">Certificate Course in Desktop Publishing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Course Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Auto-filled based on course"
                      disabled={saved && !editingCertificate}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Completion Date *</Label>
                    <Input
                      id="completionDate"
                      type="date"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      required
                      disabled={saved && !editingCertificate}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Performance</Label>
                  <Select 
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })} 
                    disabled={saved && !editingCertificate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCoordinator">Student Co-ordinator</Label>
                  <Input
                    id="studentCoordinator"
                    value={formData.studentCoordinator}
                    onChange={(e) => setFormData({ ...formData, studentCoordinator: e.target.value })}
                    placeholder="Enter student co-ordinator's name"
                    disabled={saved && !editingCertificate}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="certificateId"
                      value={formData.certificateId}
                      onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                      placeholder="Auto-generated ID"
                      readOnly
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateCertificateId} 
                      disabled={(saved && !editingCertificate) || editingCertificate}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingCertificate ? "Updating..." : "Saving..."}
                      </>
                    ) : editingCertificate ? (
                      "Update Certificate"
                    ) : saved ? (
                      "Certificate Saved"
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate Certificate
                      </>
                    )}
                  </Button>
                  {(saved || editingCertificate) && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      New Certificate
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="space-y-6">
            {showPreview ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Certificate Preview</CardTitle>
                        <CardDescription>A4 Portrait certificate with logo</CardDescription>
                      </div>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div ref={certificateRef}>
                      <CertificatePreview data={formData} showPrintButton={true} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>
                      QR code for certificate verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <QRCodeGenerator
                      data={`${window.location.origin}/verify?id=${formData.certificateId}`}
                      filename={`${formData.studentName.replace(/\s+/g, '_')}_${formData.certificateId}`}
                      size={200}
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-64 flex items-center justify-center border-dashed">
                <div className="text-center text-gray-500">
                  <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Certificate preview will appear here</p>
                  <p className="text-sm">Fill the form and click "Generate Certificate"</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificate;
