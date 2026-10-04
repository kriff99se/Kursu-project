const express = require("express");

const router = express.Router();

// GET /status — report how long the server has been running
router.get("/", (req, res) => {
  res.json({ uptime: process.uptime() });
});

module.exports = router;
