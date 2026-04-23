const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all job routes
router.use(protect);

router.route("/").get(getJobs).post(createJob);

router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);

module.exports = router;
