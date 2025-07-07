const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password
  },
});

const Signup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      verified: false
    });

    await user.save();

    // Generate verification token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Send verification email
    await transporter.sendMail({
      from: `AI Assistant <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: "Verify your email",
      html: `<h3>Hi ${user.full_name},</h3><p>Click the link to verify your email:</p><a href="${url}">Verify Email</a>`
    });

    res.status(201).json({ message: "Verification email sent." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Registration failed." });
  }
};
const Login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Server error during login." });
  }
}
const Verifymail =async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("User not found");
    if (user.email_verified) return res.send("Already verified.");

    user.email_verified = true;
    await user.save();
    // res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  } catch (err) {
    res.status(400).send("Invalid or expired link.");
  }
}
module.exports = {Signup,Login,Verifymail}