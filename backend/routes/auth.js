const express = require("express");
const { Signup, Login, Verifymail } = require("../controllers/auth");
const router = express.Router();

router.post("/register",Signup );

router.post("/login",Login );

router.get("/verify-email/:token", Verifymail);

// 3. Registration Route with Email Verification


// 4. Email Verification Endpoint


module.exports = router;
