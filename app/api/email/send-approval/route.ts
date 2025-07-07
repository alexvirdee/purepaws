import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
    const body = await req.json();

    const { to, breederName } = body;

    // TODO: Add CTA To PurePaws Breeder Dashboard once site is live
    const message = {
        to, // recipient email
        from: "woofpurepaws@gmail.com",
        subject: "🎉 Your Breeder Application Has Been Approved!",
        text: `Hi ${breederName},\n\nCongratulations! Your breeder profile has been approved and is now live on PurePaws.\n\nStart adding your litters and connect with future puppy families!\n\n🐾 The PurePaws Team`,
        html: `<p>Hi ${breederName},</p><p>Congratulations! Your breeder profile has been approved and is now live on <strong>PurePaws</strong>.</p><p>Start adding your litters and connect with future puppy families!</p><p>🐾 The PurePaws Team</p>`,
    }

    try {
        await sgMail.send(message);
        return NextResponse.json({ success: true, message: "Email sent!" });
    } catch (error) {
        console.error("[sendgrid_error]", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}