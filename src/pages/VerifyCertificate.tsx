
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle, QrCode, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VerifyCertificate = () => {
  const { toast } = useToast();
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock certificate data - in a real app, this would come from a database
  const mockCertificates = {
    "MIE-1704067200000-ABC123DEF": {
      studentName: "John Doe",
      courseName: "Web Development",
      duration: "6 months",
      completionDate: "2024-01-15",
      grade: "Excellent",
      instructorName: "Prof. Smith",
      issueDate: "2024-01-20",
      isValid: true,
    },
    "MIE-1704153600000-XYZ789GHI": {
      studentName: "Jane Smith",
      courseName: "Digital Marketing",
      duration: "3 months",
      completionDate: "2024-01-10",
      grade: "Very Good",
      instructorName: "Prof. Johnson",
      issueDate: "2024-01-15",
      isValid: true,
    },
  };

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

    // Simulate API call delay
    setTimeout(() => {
      const certificate = mockCertificates[certificateId as keyof typeof mockCertificates];
      
      if (certificate) {
        setVerificationResult({
          ...certificate,
          certificateId,
          verifiedAt: new Date().toISOString(),
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
      setIsVerifying(false);
    }, 1500);
  };

  const handleQRScan = () => {
    toast({
      title: "QR Scanner",
      description: "QR scanner would open here in a real implementation.",
    });
    // In a real implementation, this would open the camera for QR scanning
    // For demo purposes, we'll use a mock certificate ID
    setCertificateId("MIE-1704067200000-ABC123DEF");
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
            <h1 className="text-xl font-semibold">Verify Certificate</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>
                Enter the certificate ID or scan the QR code to verify authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="certificateId"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      placeholder="Enter certificate ID (e.g., MIE-1704067200000-ABC123DEF)"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleQRScan}>
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Certificate IDs */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Demo Certificate IDs</CardTitle>
              <CardDescription className="text-blue-700">
                Try these sample certificate IDs for testing:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded border">
                  <code className="text-sm">MIE-1704067200000-ABC123DEF</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCertificateId("MIE-1704067200000-ABC123DEF")}
                  >
                    Use This ID
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded border">
                  <code className="text-sm">MIE-1704153600000-XYZ789GHI</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCertificateId("MIE-1704153600000-XYZ789GHI")}
                  >
                    Use This ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card className={verificationResult.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <CardTitle className={verificationResult.isValid ? "text-green-900" : "text-red-900"}>
                      {verificationResult.isValid ? "Certificate Verified ✓" : "Verification Failed ✗"}
                    </CardTitle>
                    <CardDescription className={verificationResult.isValid ? "text-green-700" : "text-red-700"}>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Certificate Details</h4>
                      <dl className="space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Student Name:</dt>
                          <dd className="text-sm font-medium">{verificationResult.studentName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Course:</dt>
                          <dd className="text-sm font-medium">{verificationResult.courseName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Duration:</dt>
                          <dd className="text-sm font-medium">{verificationResult.duration}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Grade:</dt>
                          <dd className="text-sm font-medium">{verificationResult.grade}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verification Info</h4>
                      <dl className="space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Certificate ID:</dt>
                          <dd className="text-sm font-medium break-all">{verificationResult.certificateId}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Completion Date:</dt>
                          <dd className="text-sm font-medium">{verificationResult.completionDate}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Instructor:</dt>
                          <dd className="text-sm font-medium">{verificationResult.instructorName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Verified At:</dt>
                          <dd className="text-sm font-medium">
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
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
