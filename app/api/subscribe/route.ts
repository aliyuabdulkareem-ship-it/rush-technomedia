import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    // If no API key is set yet, simulate success so the site can deploy without crashing
    if (!apiKey) {
      console.log("Simulated email sent to:", email);
      return NextResponse.json({ 
        success: true, 
        message: "Simulated success. Add RESEND_API_KEY in Vercel settings to send real emails." 
      });
    }

    // Only load Resend if the key actually exists
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const unsubscribeToken = Buffer.from(email).toString("base64");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rushtechnomedia.com";
    const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

    const { data, error } = await resend.emails.send({
      from: "Rush Technomedia <newsletter@rushtechnomedia.com>",
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

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
