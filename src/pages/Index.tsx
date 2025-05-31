
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, QrCode, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Masscom Infotech Education
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Certificate Generation & Verification System
          </p>
          <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
            Generate professional certificates with QR code verification for our computer education programs.
            Secure, reliable, and instantly verifiable credentials for all our graduates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAdmin() && (
              <Link to="/generate">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Award className="mr-2 h-5 w-5" />
                  Generate Certificate
                </Button>
              </Link>
            )}
            <Link to="/verify">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <QrCode className="mr-2 h-5 w-5" />
                Verify Certificate
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Certification System?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets educational excellence in our comprehensive certificate management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Secure & Tamper-Proof</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Each certificate contains a unique QR code that ensures authenticity and prevents fraud.
                  Our verification system provides instant validation of credentials.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Instant Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Employers and institutions can verify certificates instantly by scanning the QR code
                  or entering the certificate ID online.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Professional Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Beautiful, professional certificate designs that reflect the quality of education
                  provided by Masscom Infotech Education.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
