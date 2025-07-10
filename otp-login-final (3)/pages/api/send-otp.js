import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = {};

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const expires = Date.now() + 5 * 60 * 1000; // صالح لمدة ٥ دقائق

  otpStore[email] = { otp, expires };

  const msg = {
    to: email,
    from: 'noreply@yourdomain.com',
    subject: 'رمز التحقق OTP',
    text: `رمز التحقق الخاص بك هو: ${otp}`,
    html: `<strong>رمز التحقق الخاص بك هو: ${otp}</strong>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}
