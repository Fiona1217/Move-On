import 'dotenv/config';
import nodemailer from "nodemailer";
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(
        require('fs').readFileSync(process.env.FIREBASE_KEY_PATH, 'utf-8')
      )
    )
  });
}

const db = admin.firestore();
const OTP_COLLECTION = 'otps';

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { action, email, otp } = JSON.parse(event.body || "{}");
  if (!email) return { statusCode: 400, body: "Email is required" };

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  if (action === "send") {
    const generatedOtp = (Math.floor(Math.random() * 900000) + 100000).toString();
    const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5*60*1000)); // 5 min

    await db.collection(OTP_COLLECTION).doc(email).set({ otp: generatedOtp, expiresAt });

    try {
  await transporter.sendMail({
    from: `"Move On" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Move On OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Your Move On OTP Code</h2>
        <p>Your one-time password (OTP) is:</p>
        <p style="font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 10px; text-align: center;">${generatedOtp}</p>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        <p style="margin-bottom: 20px;">If you did not request this code, simply ignore this email.</p>
        <p style="margin-bottom: 3px;">Thank you,<br/>Move On Team</p>
      </div>
    `,
  });

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
} catch (err) {
  console.error("Nodemailer error:", err);
  return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
}
  }

  if (action === "verify") {
    const doc = await db.collection(OTP_COLLECTION).doc(email).get();
    if (!doc.exists) return { statusCode: 200, body: JSON.stringify({ verified: false }) };

    const data = doc.data();
    const now = admin.firestore.Timestamp.now();

    if (data.otp === otp && data.expiresAt.toMillis() > now.toMillis()) {
      await db.collection(OTP_COLLECTION).doc(email).delete(); // remove after verification
      return { statusCode: 200, body: JSON.stringify({ verified: true }) };
    } else {
      return { statusCode: 200, body: JSON.stringify({ verified: false }) };
    }
  }

  return { statusCode: 400, body: "Invalid action" };
}
