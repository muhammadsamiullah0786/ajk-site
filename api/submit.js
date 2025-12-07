import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const d = req.body || {};
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const FROM_NAME = process.env.FROM_NAME || 'AJK Insurance';
    if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
      return res.status(500).json({ error: 'SMTP or ADMIN_EMAIL not configured' });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    const html = `
      <h3>New Application — AJK Insurance Brokers LLC</h3>
      <p><strong>Name:</strong> ${d.fullName || '-'}</p>
      <p><strong>Email:</strong> ${d.email || '-'}</p>
      <p><strong>Phone:</strong> ${d.phone || '-'}</p>
      <p><strong>DOB:</strong> ${d.dob || '-'}</p>
      <p><strong>Insurance Type:</strong> ${d.insuranceType || '-'}</p>
      <p><strong>City / Country:</strong> ${d.city || '-'} / ${d.country || '-'}</p>
      <p><strong>Message:</strong> ${d.message || '-'}</p>
    `;
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Lead — ${d.fullName || 'Website'}`,
      html
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SMTP error:', err);
    return res.status(500).json({ error: 'Email failed', detail: String(err) });
  }
}
