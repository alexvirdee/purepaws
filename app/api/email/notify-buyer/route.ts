import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  const body = await req.json();

  const { to, buyerName, breederName, dogName } = body;

//   console.log("[sendgrid_notify_buyer]", { to, buyerName, breederName, dogName });

  if (!to || !buyerName || !breederName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message = {
    to, // recipient email
    from: "woofpurepaws@gmail.com",
    subject: `📩 ${breederName} has messaged you on PurePaws!`,
    text: `Hi ${buyerName},

Good news! ${breederName} has started a conversation with you about ${dogName || "a puppy"}.

Log in to PurePaws to view and reply.

🐾 The PurePaws Team
`,
    html: `
      <p>Hi ${buyerName},</p>
      <p><strong>${breederName}</strong> has started a conversation with you about ${dogName ? `<strong>${dogName}</strong>` : "a puppy"}.</p>
      <p><a href="https://purepaws.com/profile/messages">View Messages</a></p>
      <p>🐾 The PurePaws Team</p>
    `
  };

  try {
    await sgMail.send(message);
    return NextResponse.json({ success: true, message: "Buyer notified!" });
  } catch (error) {
    console.error("[sendgrid_error]", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
