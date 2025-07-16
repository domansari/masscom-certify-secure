
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import CertificatePreview from "@/components/CertificatePreview";
import { CertificateData } from "@/types/certificate";

const GenerateCertificate = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CertificateData>({
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
  const [qrCodeData, setQrCodeData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const generateCertificateId = () => {
    const prefix = "CERT";
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const certificateId = generateCertificateId();
    const qrCodeData = JSON.stringify({
      studentName: formData.studentName,
      courseName: formData.courseName,
      completionDate: formData.completionDate,
      certificateId: certificateId
    });

    try {
      // Get current user for created_by field
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('certificates')
        .insert([
          {
            student_name: formData.studentName,
            father_name: formData.fatherName,
            course_name: formData.courseName,
            duration: formData.duration,
            completion_date: formData.completionDate,
            grade: formData.grade,
            student_coordinator: formData.studentCoordinator,
            roll_no: formData.rollNo,
            certificate_id: certificateId,
            qr_code_data: qrCodeData,
            created_by: user.id
          }
        ]);

      if (error) {
        throw error;
      }

      // Update form data with generated certificate ID
      setFormData(prevData => ({
        ...prevData,
        certificateId: certificateId
      }));

      setQrCodeData(qrCodeData);
      toast({
        title: "Certificate Generated",
        description: "Certificate has been successfully generated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate certificate.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-xl font-semibold text-white">Generate Certificate</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Generate Certificate</CardTitle>
            <CardDescription className="text-gray-200">
              Fill out the form below to generate a new certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName" className="text-white">Student Name</Label>
                  <Input
                    type="text"
                    id="studentName"
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName" className="text-white">Father's Name</Label>
                  <Input
                    type="text"
                    id="fatherName"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseName" className="text-white">Course Name</Label>
                  <Input
                    type="text"
                    id="courseName"
                    placeholder="Enter course name"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-white">Duration</Label>
                  <Input
                    type="text"
                    id="duration"
                    placeholder="Enter duration (e.g., 6 months)"
                    value={formData.duration}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="completionDate" className="text-white">Completion Date</Label>
                  <Input
                    type="date"
                    id="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade" className="text-white">Grade</Label>
                  <Input
                    type="text"
                    id="grade"
                    placeholder="Enter grade (e.g., A+)"
                    value={formData.grade}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentCoordinator" className="text-white">Student Coordinator</Label>
                  <Input
                    type="text"
                    id="studentCoordinator"
                    placeholder="Enter student coordinator name"
                    value={formData.studentCoordinator}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
                 <div>
                  <Label htmlFor="rollNo" className="text-white">Roll Number</Label>
                  <Input
                    type="text"
                    id="rollNo"
                    placeholder="Enter Roll Number"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
              </div>

              {formData.certificateId && (
                <div>
                  <Label htmlFor="certificateId" className="text-white">Certificate ID</Label>
                  <Input
                    type="text"
                    id="certificateId"
                    value={formData.certificateId}
                    readOnly
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="additionalInfo" className="text-white">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Enter any additional information"
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Certificate
                  </>
                )}
              </Button>
            </form>

            {qrCodeData && (
              <div className="mt-6 p-4 border border-white/30 rounded-md">
                <h3 className="text-lg font-semibold text-white mb-4">QR Code Preview</h3>
                <QRCodeGenerator data={qrCodeData} />
              </div>
            )}
          </CardContent>
        </Card>

        {formData.studentName && formData.courseName && formData.completionDate && formData.studentCoordinator && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Certificate Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificatePreview data={formData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GenerateCertificate;
