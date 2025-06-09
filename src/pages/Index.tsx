
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Shield, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <div 
        className="min-h-screen"
        style={{
       backgroundImage: `url('/lovable-uploads/f0d1378d-119b-4fea-80f3-ead49ffa08f1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Masscom Infotech Education
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Certificate Generation & Verification System
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/verify">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Shield className="mr-2 h-5 w-5" />
                  Verify Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('/lovable-uploads/f0d1378d-119b-4fea-80f3-ead49ffa08f1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Masscom Infotech Education
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Certificate Management System
          </p>
        </div>
      </div>

      <div className="relative z-10 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Generate New Certificate */}
            <Link to="/generate">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-52 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Generate New Certificate</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">Create a new certificate for students</p>
                </CardContent>
              </Card>
            </Link>

            {/* Search and Edit/Reissue */}
            <Link to="/generate">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-52 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Search & Edit/Reissue</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">Search and modify existing certificates</p>
                </CardContent>
              </Card>
            </Link>

            {/* Print Certificate */}
            <Link to="/generate">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-52 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Printer className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Print Certificate</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">Select and print existing certificates</p>
                </CardContent>
              </Card>
            </Link>

            {/* Verify Certificate */}
            <Link to="/verify">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-52 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Verify Certificate</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">Verify certificate authenticity</p>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
