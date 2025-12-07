// pages/api/contact.js
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

let client;

// Singleton MongoClient to avoid multiple connections in dev
if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.MONGO_URI);
  global._mongoClientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const data = req.body || {};

  const { fullName, email, phone, dob, insuranceType, city, country, message } = data;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  try {
    // --- MongoDB ---
    const dbClient = await global._mongoClientPromise;
    const db = dbClient.db("ajk_forms");
    const collection = db.collection("submissions");

    await collection.insertOne({
      fullName,
      email,
      phone,
      dob: dob || "",
      insuranceType: insuranceType || "",
      city: city || "",
      country: country || "",
      message: message || "",
      submittedAt: new Date(),
    });

    // --- Email ---
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const FROM_NAME = process.env.FROM_NAME || "AJK Insurance";

    if (SMTP_USER && SMTP_PASS && ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const html = `
        <h3>New Application — AJK Insurance Brokers LLC</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>DOB:</strong> ${dob || "-"}</p>
        <p><strong>Insurance Type:</strong> ${insuranceType || "-"}</p>
        <p><strong>City / Country:</strong> ${city || "-"} / ${country || "-"}</p>
        <p><strong>Message:</strong> ${message || "-"}</p>
      `;

      await transporter.sendMail({
        from: `"${FROM_NAME}" <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `New Lead — ${fullName}`,
        html,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error in contact API:", err);
    return res.status(500).json({ ok: false, error: "Internal Server Error", detail: String(err) });
  }
}
