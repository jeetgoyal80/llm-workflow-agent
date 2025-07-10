const nodemailer = require("nodemailer");
const User = require("../models/User");

const isDev = process.env.NODE_ENV !== "production";

async function EmailAgent(userId, info) {
  const { to, subject, body,  message } = info;

  // 1. Validate user
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");

  // 2. Credentials fallback
  // const smtpUser = user.email_smtp?.user || (isDev ? process.env.EMAIL : null);
  // const smtpPass = user.email_smtp?.pass || (isDev ? process.env.EMAIL_PASS : null);
  const smtpUser =  (isDev ? process.env.EMAIL_USER : null);
  const smtpPass = (isDev ? process.env.EMAIL_PASS : null);
  console.log(smtpUser,smtpPass);
  

  if (!smtpUser || !smtpPass) {
    throw new Error("Email credentials are not set for this user.");
  }

  // 3. Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  // 4. Build body if missing
  let finalBody = body;
  if (!finalBody && message) {
    finalBody = `Dear Sir,\n\n${message}\n\nRegards,\n${user.full_name || "Your Employee"}`;
    // if (companyName) {
    //   finalBody += `\n${companyName}`;
    // }
  }

  // 5. Send email
  await transporter.sendMail({
    from: smtpUser,
    to,
    subject: subject || `Leave Notice`,
    text: finalBody || "No message content provided."
  });

  return `📧 Email sent from ${smtpUser} to ${to}`;
}

module.exports = { EmailAgent };
