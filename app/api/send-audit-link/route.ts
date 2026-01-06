import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, auditorName, templateName, accessLink } = await req.json();

    // Configure your SMTP transporter
    // IMPORTANT: In production, use environment variables for these values
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"AuditFlow System" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `New Audit Assigned: ${templateName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e293b; margin-bottom: 16px;">New Audit Assigned</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            Hello <strong>${auditorName}</strong>,
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            You have been assigned to conduct a new audit: <strong>${templateName}</strong>.
          </p>
          <div style="margin: 32px 0;">
            <a href="${accessLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Access Audit Questions
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            If the button above doesn't work, copy and paste this link into your browser:<br/>
            <span style="color: #2563eb;">${accessLink}</span>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Nodemailer error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
