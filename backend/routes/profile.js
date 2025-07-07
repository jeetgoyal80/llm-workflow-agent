const express = require("express");

const multer = require("multer");
const storage = multer.memoryStorage(); // store in memory, suitable for cloudinary
const upload = multer({ storage });
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} = require("../controllers/profile");
const  auth  = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/upload-avatar", auth,upload.single('avatar'), uploadAvatar);
router.post("/change-password", auth, changePassword);

module.exports = router;
