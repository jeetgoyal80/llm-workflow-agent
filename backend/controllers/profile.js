const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");

// GET Profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// UPDATE Profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  console.log(req.body);
  
  user.full_name = req.body.name || user.full_name;
  await user.save();
  res.json({ message: "Profile updated." });
};

// Upload Avatar


const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        transformation: [{ width: 300, crop: "scale" }],
        resource_type: "image"
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        // Save to DB
        await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url });
        return res.json({ success: true, avatar: result.secure_url });
      }
    );

    // Pipe the buffer to Cloudinary
    require("streamifier").createReadStream(req.file.buffer).pipe(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};




// Change Password
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { current, new: newPassword, confirm } = req.body;

    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if required fields are provided
    if (!current || !newPassword || !confirm) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid current password." });
    }

    // Check if new and confirm passwords match
    if (newPassword !== confirm) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    // Hash and save the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("❌ Password Change Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
};
