
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

    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");
    const msg91SenderId = Deno.env.get("MSG91_SENDER_ID");
    const msg91Route = Deno.env.get("MSG91_ROUTE") || "4"; // Default to transactional route
    const msg91TemplateId = Deno.env.get("MSG91_TEMPLATE_ID");

    console.log('MSG91 config check:', {
      hasAuthKey: !!msg91AuthKey,
      hasSenderId: !!msg91SenderId,
      hasRoute: !!msg91Route,
      hasTemplateId: !!msg91TemplateId
    });

    if (!msg91AuthKey || !msg91SenderId || !msg91TemplateId) {
      throw new Error("MSG91 credentials not configured properly");
    }

    const message = purpose === 'login' 
      ? `Your MIE login OTP is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`
      : `Your MIE deletion confirmation OTP is: ${otp}. This code will expire in 5 minutes. Do not share this code.`;

    console.log('Sending SMS with message:', message);

    // Clean phone number - remove country code if present for MSG91
    const cleanPhoneNumber = phoneNumber.startsWith('+91') 
      ? phoneNumber.substring(3) 
      : phoneNumber.replace(/^\+/, '');

    const msg91Url = 'https://control.msg91.com/api/v5/otp';
    
    const payload = {
      template_id: msg91TemplateId,
      mobile: cleanPhoneNumber,
      authkey: msg91AuthKey,
      otp: otp
    };

    console.log('Making request to MSG91 API for phone:', cleanPhoneNumber);

    const response = await fetch(msg91Url, {
      method: 'POST',
      headers: {
        'authkey': msg91AuthKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('MSG91 response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MSG91 API error response:', errorText);
      throw new Error(`MSG91 API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("SMS sent successfully via MSG91:", result);

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
