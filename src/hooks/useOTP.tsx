
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseOTPReturn {
  sendOTP: (purpose: 'login' | 'delete') => Promise<boolean>;
  verifyOTP: (inputOTP: string) => boolean;
  otp: string | null;
  isLoading: boolean;
  timeLeft: number;
  canResend: boolean;
}

export const useOTP = (): UseOTPReturn => {
  const [otp, setOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = useCallback(async (purpose: 'login' | 'delete'): Promise<boolean> => {
    setIsLoading(true);
    const generatedOTP = generateOTP();
    
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: '+917007017256',
          otp: generatedOTP,
          purpose
        }
      });

      if (error) throw error;

      setOtp(generatedOTP);
      setTimeLeft(300); // 5 minutes
      
      // Start countdown
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setOtp(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "OTP Sent",
        description: `OTP sent to +917007017256 for ${purpose}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const verifyOTP = useCallback((inputOTP: string): boolean => {
    if (!otp) return false;
    return inputOTP === otp;
  }, [otp]);

  return {
    sendOTP,
    verifyOTP,
    otp,
    isLoading,
    timeLeft,
    canResend: timeLeft === 0
  };
};
