
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Plus, Settings, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Certificate Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate, manage, and verify digital certificates with ease. 
            Secure, professional, and efficient certificate management for educational institutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {isAdmin && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/generate">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Generate Certificate</CardTitle>
                    <CardDescription>
                      Create new certificates for students with digital signatures and QR codes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" size="lg">
                      Start Creating
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/manage">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Settings className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Manage Certificates</CardTitle>
                    <CardDescription>
                      View, edit, delete, and manage existing certificates with batch operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" size="lg">
                      Manage Now
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/print-certificates">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <Printer className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">Print Certificates</CardTitle>
                    <CardDescription>
                      Select and print multiple certificates or entire batches for download
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" size="lg">
                      Print Now
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </>
          )}

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/verify">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Verify Certificate</CardTitle>
                <CardDescription>
                  Instantly verify the authenticity of any certificate using QR codes or certificate IDs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" size="lg">
                  Verify Now
                </Button>
              </CardContent>
            </Link>
          </Card>

          {!isAdmin && (
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-600" />
                </div>
                <CardTitle className="text-xl">Welcome</CardTitle>
                <CardDescription>
                  You can verify certificates using the verification tool. Contact your administrator for certificate generation access.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Digital Certificates</h3>
                <p className="text-sm text-gray-600">Professional certificate templates with institutional branding</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">QR Verification</h3>
                <p className="text-sm text-gray-600">Instant verification through QR codes and unique certificate IDs</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Printer className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-medium mb-2">Batch Printing</h3>
                <p className="text-sm text-gray-600">Print multiple certificates and entire batches efficiently</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Management Tools</h3>
                <p className="text-sm text-gray-600">Comprehensive tools for certificate lifecycle management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
