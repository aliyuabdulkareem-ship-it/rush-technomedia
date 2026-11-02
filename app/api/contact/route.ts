import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, scope } = await req.json();
    if (!name || !email || !scope) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Save to Supabase
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('strategy_sessions').insert([{ full_name: name, email, service_scope: scope }]);
      } catch (err) { console.error("DB error:", err); }
    }

    // 2. Send Emails via Resend
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        // Email to YOU (Admin)
        await resend.emails.send({
          from: "Rush Technomedia <onboarding@resend.dev>",
          to: ["hello@rushtechnomedia.com"],
          subject: `New Strategy Session Request: ${name}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Interested in:</strong> ${scope}</p>`
        });

        // Auto-reply to CLIENT
        await resend.emails.send({
          from: "Rush Technomedia <onboarding@resend.dev>",
          to: [email],
          subject: "We received your Strategy Session request",
          html: `<div style="font-family: sans-serif; padding: 20px; background: #f4f4f5;"><h2>Hi ${name},</h2><p>Thank you for reaching out to Rush Technomedia. We have received your request for a <strong>${scope}</strong> strategy session.</p><p>One of our senior partners will review your details and reach out to you within 24 hours to schedule your workshop.</p><p>Best regards,<br/>The Rush Technomedia Team</p></div>`
        });
      } catch (err) { console.error("Email error:", err); }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
