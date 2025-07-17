
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowDown, Shield, Smartphone } from "lucide-react";
import { useOTP } from "@/hooks/useOTP";
import OTPInput from "@/components/OTPInput";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'otp'>('email');
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendOTP, verifyOTP, isLoading: otpLoading, timeLeft, canResend } = useOTP();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    const success = await sendOTP('login');
    if (success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async () => {
    if (verifyOTP(otpValue)) {
      // For demo purposes, we'll sign in with a default admin account
      // In production, you'd have a proper OTP verification system
      try {
        const { error } = await signIn("admin@masscom.com", "admin123");
        
        if (error) {
          toast({
            title: "OTP Verification Failed",
            description: "Unable to complete OTP login",
            variant: "destructive",
          });
        } else {
          toast({
            title: "OTP Verified!",
            description: "You have been signed in successfully.",
          });
          navigate("/");
        }
      } catch (error: any) {
        toast({
          title: "OTP Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check the OTP and try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="w-full max-w-md relative z-10 space-y-6">
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Administrator Login</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your admin account to manage certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex space-x-2">
                <Button
                  variant={authMode === 'email' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('email')}
                  className="flex-1"
                >
                  Email Login
                </Button>
                <Button
                  variant={authMode === 'otp' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('otp')}
                  className="flex-1"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  OTP Login
                </Button>
              </div>
            </div>

            {authMode === 'email' ? (
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                {!otpSent ? (
                  <div className="text-center space-y-4">
                    <p className="text-white text-sm">
                      An OTP will be sent to +917007017256
                    </p>
                    <Button
                      onClick={handleSendOTP}
                      disabled={otpLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                    >
                      {otpLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Smartphone className="mr-2 h-4 w-4" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-white">Enter 6-digit OTP</Label>
                      <p className="text-sm text-gray-300 mt-1">
                        Sent to +917007017256
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <OTPInput
                        value={otpValue}
                        onChange={setOtpValue}
                      />
                    </div>

                    {timeLeft > 0 && (
                      <p className="text-center text-sm text-gray-300">
                        Time remaining: {formatTime(timeLeft)}
                      </p>
                    )}

                    <div className="space-y-2">
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={otpValue.length !== 6}
                        className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                      >
                        Verify OTP
                      </Button>
                      
                      {canResend && (
                        <Button
                          onClick={handleSendOTP}
                          variant="outline"
                          disabled={otpLoading}
                          className="w-full"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verify Certificate Card */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Verify Certificate</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Verify the authenticity of any certificate without logging in
                </p>
                <Link to="/verify">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg transition-all duration-300 hover:scale-105">
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Now
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
