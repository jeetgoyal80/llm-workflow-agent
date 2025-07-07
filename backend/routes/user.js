const express = require("express");
const auth = require("../middlewares/authmiddleware");
const { SMTP, WhatsApp, AddContact, fetchContacts, deleteContact } = require("../controllers/user");
const router = express.Router();

// ✅ Connect user's email (SMTP)
router.post("/connect/email", auth,SMTP );
// ✅ Connect user's WhatsApp (Twilio SID + token)
router.post("/connect/whatsapp", auth,WhatsApp );
// ✅ Add a contact (e.g. "my boss")
router.post("/contacts", auth,AddContact );
router.get("/contacts", auth, fetchContacts);
router.delete("/contacts/:name", auth, deleteContact);
module.exports = router;