
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Plus, Settings, Shield, Cpu, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Certificate Management System
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Generate, manage, and verify digital certificates with ease. 
            Secure, professional, and efficient certificate management for educational institutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {isAdmin && (
            <>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15">
                <Link to="/generate">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">Generate Certificate</CardTitle>
                    <CardDescription className="text-gray-300">
                      Create new certificates for students with digital signatures and QR codes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800" size="lg">
                      Start Creating
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15">
                <Link to="/manage">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">Manage Certificates</CardTitle>
                    <CardDescription className="text-gray-300">
                      View, edit, delete, and manage existing certificates with batch operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" size="lg">
                      Manage Now
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </>
          )}

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15">
            <Link to="/verify">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Verify Certificate</CardTitle>
                <CardDescription className="text-gray-300">
                  Instantly verify the authenticity of any certificate using QR codes or certificate IDs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" size="lg">
                  Verify Now
                </Button>
              </CardContent>
            </Link>
          </Card>

          {!isAdmin && (
            <Card className="md:col-span-2 lg:col-span-1 bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Welcome</CardTitle>
                <CardDescription className="text-gray-300">
                  You can verify certificates using the verification tool. Contact your administrator for certificate generation access.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-8 max-w-4xl mx-auto border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium mb-2 text-white">Digital Certificates</h3>
                <p className="text-sm text-gray-300">Professional certificate templates with institutional branding</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium mb-2 text-white">QR Verification</h3>
                <p className="text-sm text-gray-300">Instant verification through QR codes and unique certificate IDs</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium mb-2 text-white">Smart Management</h3>
                <p className="text-sm text-gray-300">Comprehensive tools for certificate lifecycle management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
