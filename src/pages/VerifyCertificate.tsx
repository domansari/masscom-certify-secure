
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, Printer } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import CertificatePreview from "@/components/CertificatePreview";

const VerifyCertificate = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get('id') || "");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (searchParams.get('id')) {
      handleVerify();
    }
  }, []);

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      toast({
        title: "Missing Certificate ID",
        description: "Please enter a certificate ID to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId.trim())
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setVerificationResult({
          isValid: true,
          certificateId: data.certificate_id,
          studentName: data.student_name,
          fatherName: data.father_name,
          courseName: data.course_name,
          duration: data.duration,
          completionDate: data.completion_date,
          grade: data.grade,
          studentCoordinator: data.student_coordinator,
          rollNo: data.roll_no || "",
          issueDate: new Date(data.created_at).toLocaleDateString(),
          verifiedAt: new Date().toISOString(),
          certificateData: {
            studentName: data.student_name,
            fatherName: data.father_name || "",
            courseName: data.course_name,
            duration: data.duration || "",
            completionDate: data.completion_date,
            grade: data.grade || "",
            studentCoordinator: data.student_coordinator || "",
            certificateId: data.certificate_id,
            rollNo: data.roll_no || "",
          }
        });
        toast({
          title: "Certificate Verified!",
          description: "This certificate is authentic and valid.",
        });
      } else {
        setVerificationResult({
          isValid: false,
          error: "Certificate not found or invalid",
        });
        toast({
          title: "Verification Failed",
          description: "This certificate could not be verified.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setVerificationResult({
        isValid: false,
        error: "Error verifying certificate",
      });
      toast({
        title: "Verification Error",
        description: error.message || "An error occurred while verifying the certificate.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQRScan = () => {
    toast({
      title: "QR Scanner",
      description: "QR scanner would open here in a real implementation.",
    });
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
            <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-200">
              <ArrowDown className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold text-white">Verify Certificate</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Verification Form */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Certificate Verification</CardTitle>
              <CardDescription className="text-gray-200">
                Enter the certificate ID or scan the QR code to verify authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateId" className="text-white">Certificate ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="certificateId"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      placeholder="Enter certificate ID"
                      className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />
                    <Button variant="outline" onClick={handleQRScan} className="border-white/30 text-white hover:bg-white/10">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleVerify} disabled={isVerifying} className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800">
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card className={`${verificationResult.isValid ? "border-green-200 bg-green-50/10" : "border-red-200 bg-red-50/10"} backdrop-blur-lg`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {verificationResult.isValid ? (
                    <ArrowUp className="h-8 w-8 text-green-400" />
                  ) : (
                    <ArrowDown className="h-8 w-8 text-red-400" />
                  )}
                  <div>
                    <CardTitle className={verificationResult.isValid ? "text-green-100" : "text-red-100"}>
                      {verificationResult.isValid ? "Certificate Verified ✓" : "Verification Failed ✗"}
                    </CardTitle>
                    <CardDescription className={verificationResult.isValid ? "text-green-200" : "text-red-200"}>
                      {verificationResult.isValid 
                        ? "This certificate is authentic and valid"
                        : verificationResult.error
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {verificationResult.isValid && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Certificate Details</h4>
                      <dl className="space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Student Name:</dt>
                          <dd className="text-sm font-medium text-white">{verificationResult.studentName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Father's Name:</dt>
                          <dd className="text-sm font-medium text-white">{verificationResult.fatherName}</dd>
                        </div>
                        {verificationResult.rollNo && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-300">Roll No:</dt>
                            <dd className="text-sm font-medium text-white">{verificationResult.rollNo}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Course:</dt>
                          <dd className="text-sm font-medium text-white">{verificationResult.courseName}</dd>
                        </div>
                        {verificationResult.duration && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-300">Duration:</dt>
                            <dd className="text-sm font-medium text-white">{verificationResult.duration}</dd>
                          </div>
                        )}
                        {verificationResult.grade && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-300">Grade:</dt>
                            <dd className="text-sm font-medium text-white">{verificationResult.grade}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Verification Info</h4>
                      <dl className="space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Certificate ID:</dt>
                          <dd className="text-sm font-medium break-all text-white">{verificationResult.certificateId}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Completion Date:</dt>
                          <dd className="text-sm font-medium text-white">{new Date(verificationResult.completionDate).toLocaleDateString()}</dd>
                        </div>
                        {verificationResult.studentCoordinator && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-300">Student Co-ordinator:</dt>
                            <dd className="text-sm font-medium text-white">{verificationResult.studentCoordinator}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Issue Date:</dt>
                          <dd className="text-sm font-medium text-white">{verificationResult.issueDate}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-300">Verified At:</dt>
                          <dd className="text-sm font-medium text-white">
                            {new Date(verificationResult.verifiedAt).toLocaleString()}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Certificate Preview */}
          {verificationResult && verificationResult.isValid && verificationResult.certificateData && (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Certificate Preview</CardTitle>
                <CardDescription className="text-gray-200">
                  Preview of the verified certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificatePreview data={verificationResult.certificateData} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
