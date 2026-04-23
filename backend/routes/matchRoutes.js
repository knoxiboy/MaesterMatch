const express = require("express");
const { getJobMatches } = require("../controllers/matchController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all match routes
router.use(authMiddleware);

router.route("/:jobId").get(getJobMatches);

module.exports = router;
