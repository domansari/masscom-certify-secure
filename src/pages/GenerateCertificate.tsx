
import { useState } from "react";
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

const GenerateCertificate = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentName: "",
    courseName: "",
    duration: "",
    completionDate: "",
    grade: "",
    instructorName: "",
    certificateId: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      // Generate QR code data (URL for verification)
      const verificationUrl = `${window.location.origin}/verify?id=${formData.certificateId}`;
      
      // Save certificate to database
      const { error } = await supabase
        .from('certificates')
        .insert({
          certificate_id: formData.certificateId,
          student_name: formData.studentName,
          course_name: formData.courseName,
          duration: formData.duration || null,
          completion_date: formData.completionDate,
          grade: formData.grade || null,
          instructor_name: formData.instructorName || null,
          qr_code_data: verificationUrl,
          created_by: user?.id,
        });

      if (error) {
        throw error;
      }

      setShowPreview(true);
      setSaved(true);
      toast({
        title: "Certificate Generated!",
        description: "Your certificate has been generated and saved successfully.",
      });
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

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your certificate PDF is being prepared for download.",
    });
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      courseName: "",
      duration: "",
      completionDate: "",
      grade: "",
      instructorName: "",
      certificateId: "",
    });
    setShowPreview(false);
    setSaved(false);
  };

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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Fill in the student and course information to generate a certificate
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
                    disabled={saved}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, courseName: value })} disabled={saved}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                      <SelectItem value="Data Entry">Data Entry</SelectItem>
                      <SelectItem value="Computer Basics">Computer Basics</SelectItem>
                      <SelectItem value="MS Office">MS Office</SelectItem>
                      <SelectItem value="Tally">Tally</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
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
                      placeholder="e.g., 3 months"
                      disabled={saved}
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
                      disabled={saved}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Performance</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, grade: value })} disabled={saved}>
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
                  <Label htmlFor="instructorName">Instructor Name</Label>
                  <Input
                    id="instructorName"
                    value={formData.instructorName}
                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                    placeholder="Enter instructor's name"
                    disabled={saved}
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
                    <Button type="button" variant="outline" onClick={generateCertificateId} disabled={saved}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={saving || saved}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : saved ? (
                      "Certificate Saved"
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate Certificate
                      </>
                    )}
                  </Button>
                  {saved && (
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
                        <CardDescription>Preview your generated certificate</CardDescription>
                      </div>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CertificatePreview data={formData} />
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
