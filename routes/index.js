const express = require("express");

const router = express.Router();

const eligibilityService = require("../services/eligibilityService");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "SahayakAI Backend Running",
  });
});

router.get("/schemes", eligibilityService.getAllSchemes);

router.post("/eligibility", eligibilityService.checkEligibility);

module.exports = router;
