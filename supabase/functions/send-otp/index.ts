
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  phoneNumber: string;
  otp: string;
  purpose: 'login' | 'delete';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received OTP request');
    
    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { phoneNumber, otp, purpose }: SendOTPRequest = requestBody;

    if (!phoneNumber || !otp || !purpose) {
      throw new Error("Missing required fields: phoneNumber, otp, or purpose");
    }

    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    console.log('Twilio config check:', {
      hasAccountSid: !!twilioAccountSid,
      hasAuthToken: !!twilioAuthToken,
      hasPhoneNumber: !!twilioPhoneNumber
    });

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error("Twilio credentials not configured properly");
    }

    const message = purpose === 'login' 
      ? `Your MIE login OTP is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`
      : `Your MIE deletion confirmation OTP is: ${otp}. This code will expire in 5 minutes. Do not share this code.`;

    console.log('Sending SMS with message:', message);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const formData = new URLSearchParams({
      From: twilioPhoneNumber,
      To: phoneNumber,
      Body: message,
    });

    console.log('Making request to Twilio API');

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('Twilio response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twilio API error response:', errorText);
      throw new Error(`Twilio API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("SMS sent successfully:", result.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        message: "OTP sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check function logs for more information"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
