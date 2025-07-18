
import { useState, useCallback, useRef } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startCountdown = useCallback(() => {
    setTimeLeft(300); // 5 minutes
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setOtp(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const sendOTP = useCallback(async (purpose: 'login' | 'delete'): Promise<boolean> => {
    setIsLoading(true);
    const generatedOTP = generateOTP();
    
    console.log('Sending OTP:', generatedOTP, 'for purpose:', purpose);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: '+917007017256',
          otp: generatedOTP,
          purpose
        }
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to send OTP');
      }

      setOtp(generatedOTP);
      startCountdown();

      toast({
        title: "OTP Sent Successfully",
        description: `OTP sent to +917007017256 for ${purpose}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error Sending OTP",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, startCountdown]);

  const verifyOTP = useCallback((inputOTP: string): boolean => {
    console.log('Verifying OTP:', inputOTP, 'against stored OTP:', otp);
    
    if (!otp) {
      console.log('No OTP stored');
      return false;
    }
    
    const isValid = inputOTP === otp;
    console.log('OTP verification result:', isValid);
    
    if (isValid) {
      // Clear the OTP and timer on successful verification
      setOtp(null);
      setTimeLeft(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return isValid;
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
