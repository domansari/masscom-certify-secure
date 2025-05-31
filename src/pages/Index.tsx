
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, FileText, Shield, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Masscom Infotech Education</h1>
                <p className="text-sm text-gray-600">Certificate Management System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link to="/generate">
                <Button variant="outline">Generate Certificate</Button>
              </Link>
              <Link to="/verify">
                <Button>Verify Certificate</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Digital Certificate
              <span className="text-yellow-400"> Management</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Generate authentic certificates with QR codes and provide instant verification for your students at Masscom Infotech Education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generate">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Certificate
                </Button>
              </Link>
              <Link to="/verify">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  <QrCode className="mr-2 h-5 w-5" />
                  Verify Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Certificate Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and verify digital certificates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Generate Certificates</CardTitle>
                <CardDescription>
                  Create professional PDF certificates with student details and course information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Custom student information</li>
                  <li>• Professional PDF format</li>
                  <li>• Institute branding</li>
                  <li>• Unique certificate IDs</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <QrCode className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>QR Code Integration</CardTitle>
                <CardDescription>
                  Each certificate includes a unique QR code for instant verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Unique QR codes</li>
                  <li>• Instant scanning</li>
                  <li>• Mobile-friendly</li>
                  <li>• Tamper-proof</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Secure Verification</CardTitle>
                <CardDescription>
                  Verify certificates instantly using QR codes or certificate IDs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Instant verification</li>
                  <li>• Anti-fraud protection</li>
                  <li>• Real-time validation</li>
                  <li>• Detailed information</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Masscom Infotech Education</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering students with quality education and authentic certification
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Masscom Infotech Education. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
