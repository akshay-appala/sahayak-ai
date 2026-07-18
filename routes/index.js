const express = require("express");

const router = express.Router();

const {
  checkEligibility,
  getAllSchemes,
} = require("../services/eligibilityService");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "SahayakAI Backend Running",
  });
});

router.post("/eligibility", checkEligibility);
router.get("/schemes", getAllSchemes);

module.exports = router;
