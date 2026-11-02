import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1. Save to Supabase Database (Only if environment variables are set)
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { error: dbError } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email }]);

        if (dbError && dbError.code !== '23505') { 
          console.error("Supabase DB error:", dbError);
        }
      } catch (err) {
        console.error("Failed to initialize Supabase:", err);
      }
    } else {
      console.log("Supabase env vars not found. Skipping DB save for:", email);
    }

    // 2. Send Welcome Email via Resend (Only if API key is set)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        
        const unsubscribeToken = Buffer.from(email).toString("base64");
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rushtechnomedia.com";
        const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

        const { error: emailError } = await resend.emails.send({
      from: "Rush Technomedia <onboarding@resend.dev>",
          to: [email],
          subject: "Welcome to the Technomedia Dispatch 🚀",
          html: `
            <div style="font-family: sans-serif; color: #dee2f5; background: #0e1320; padding: 24px; border-radius: 8px;">
              <h2 style="color: #b9c3ff;">Welcome to the inner circle.</h2>
              <p>You're now subscribed to bi-weekly engineering memos from Rush Technomedia.</p>
              <br/>
              <p style="font-size: 12px; color: #8e90a1;">
                You are receiving this because you subscribed on rushtechnomedia.com.<br/>
                <a href="${unsubscribeUrl}" style="color: #7bd0ff; text-decoration: underline;">Unsubscribe instantly</a>
              </p>
            </div>
          `,
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });

        if (emailError) {
          console.error("Resend email error:", emailError);
        }
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    } else {
      console.log("Resend API key not found. Skipping email send for:", email);
    }

    return NextResponse.json({ success: true, message: "Subscription processed!" });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
