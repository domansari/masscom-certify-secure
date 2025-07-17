
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOTP } from '@/hooks/useOTP';
import OTPInput from '@/components/OTPInput';
import { Smartphone } from 'lucide-react';

interface Certificate {
  id: string;
  student_name: string;
}

interface DeleteCertificateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onConfirm: () => void;
  isDeleting: boolean;
  password: string;
  setPassword: (password: string) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;
}

export const DeleteCertificateDialog: React.FC<DeleteCertificateDialogProps> = ({
  isOpen,
  onClose,
  certificate,
  onConfirm,
  isDeleting,
  password,
  setPassword,
  passwordError,
  setPasswordError
}) => {
  const [verificationMethod, setVerificationMethod] = useState<'password' | 'otp'>('password');
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { sendOTP, verifyOTP, isLoading: otpLoading, timeLeft, canResend } = useOTP();

  const handleSendOTP = async () => {
    const success = await sendOTP('delete');
    if (success) {
      setOtpSent(true);
    }
  };

  const handleOTPConfirm = () => {
    if (verifyOTP(otpValue)) {
      onConfirm();
    } else {
      setPasswordError("Invalid OTP. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle>Confirm Permanent Deletion</DialogTitle>
          <DialogDescription>
            You are about to permanently delete the certificate for <strong>{certificate?.student_name}</strong>. 
            This action cannot be undone. Please verify your identity to confirm.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={verificationMethod === 'password' ? 'default' : 'outline'}
              onClick={() => setVerificationMethod('password')}
              className="flex-1"
              size="sm"
            >
              Password
            </Button>
            <Button
              variant={verificationMethod === 'otp' ? 'default' : 'outline'}
              onClick={() => setVerificationMethod('otp')}
              className="flex-1"
              size="sm"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              OTP
            </Button>
          </div>

          {verificationMethod === 'password' ? (
            <div className="space-y-2">
              <Label htmlFor="delete-password">Master Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Enter master password"
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    An OTP will be sent to +917007017256
                  </p>
                  <Button
                    onClick={handleSendOTP}
                    disabled={otpLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {otpLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
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
                <div className="space-y-3">
                  <div className="text-center">
                    <Label>Enter 6-digit OTP</Label>
                    <p className="text-sm text-gray-600 mt-1">
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
                    <p className="text-center text-sm text-gray-600">
                      Time remaining: {formatTime(timeLeft)}
                    </p>
                  )}

                  {canResend && (
                    <Button
                      onClick={handleSendOTP}
                      variant="outline"
                      disabled={otpLoading}
                      className="w-full"
                      size="sm"
                    >
                      Resend OTP
                    </Button>
                  )}

                  {passwordError && (
                    <p className="text-sm text-red-600 text-center">{passwordError}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={verificationMethod === 'password' ? onConfirm : handleOTPConfirm}
            disabled={
              isDeleting || 
              (verificationMethod === 'password' && !password) ||
              (verificationMethod === 'otp' && (!otpSent || otpValue.length !== 6))
            }
            className="hover:bg-red-600 transition-colors"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
