// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  full_name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  timezone: { type: String, default: "Asia/Kolkata" },
  // models/User.js
  google: {
    access_token: String,
    refresh_token: String,
    expiry_date: Number,
  }
  ,
  phone: { type: String },
  email_verified: { type: Boolean, default: false },

  // ✅ Avatar for profile picture
  avatar: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s" },

  // ✅ Email SMTP credentials
  email_smtp: {
    user: { type: String }, // their Gmail or custom domain email
    pass: { type: String }  // app password
  },


  // ✅ WhatsApp (Twilio) credentials
  whatsapp: {
    from: { type: String },  // WhatsApp-enabled Twilio number (e.g., +14155238886)
    sid: { type: String },
    token: { type: String }
  },

  // ✅ Contact list (name to email/phone mapping)
  contacts: [
    {
      name: { type: String, required: true },
      email: String,
      phone: String
    }
  ],

  // ✅ Timestamps
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
