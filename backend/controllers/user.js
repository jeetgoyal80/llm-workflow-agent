const User = require("../models/User");

const SMTP = async (req, res) => {
  const { email_user, email_pass } = req.body;

  if (!email_user || !email_pass) {
    return res.status(400).json({ error: "Both email and password are required." });
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      email_smtp: {
        user: email_user,
        pass: email_pass
      }
    });
    return res.json({ message: "✅ Email connected successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to connect email." });
  }
}
const WhatsApp = async (req, res) => {
  const { sid, token, from } = req.body;

  if (!sid || !token || !from) {
    return res.status(400).json({ error: "SID, token, and from number are required." });
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      whatsapp: {
        sid,
        token,
        from
      }
    });
    return res.json({ message: "✅ WhatsApp connected successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to connect WhatsApp." });
  }
}
const AddContact =async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || (!email && !phone)) {
    return res.status(400).json({ error: "Name and at least one contact method required." });
  }

  try {
    const user = await User.findById(req.user.id);
    user.contacts.push({ name, email, phone });
    await user.save();

    return res.json({ message: `✅ Contact '${name}' added.` });
  } catch (err) {
    return res.status(500).json({ error: "Failed to add contact." });
  }
}
const fetchContacts = async (req, res) => {
  try {
    // 🧠 Fetch user by ID from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Return contacts array
    return res.status(200).json(user.contacts);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch contacts. Please try again later.",
    });
  }
};

const deleteContact = async (req, res) => {
  const contactName = req.params.name?.toLowerCase();

  if (!contactName) {
    return res.status(400).json({
      success: false,
      message: "Contact name is required.",
    });
  }

  try {
    // 🔐 Fetch user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 🧹 Filter out the contact
    const originalLength = user.contacts.length;
    user.contacts = user.contacts.filter(
      (contact) => contact.name.toLowerCase() !== contactName
    );

    // 🔁 If no contact was removed
    if (user.contacts.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    await user.save();

    return res.json({
      success: true,
      message: `Contact '${contactName}' deleted successfully.`,
    });
  } catch (err) {
    console.error("❌ Error deleting contact:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the contact.",
    });
  }
};

module.exports = {SMTP,WhatsApp,AddContact,fetchContacts,deleteContact}