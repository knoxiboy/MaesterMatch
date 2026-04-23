const Job = require("../models/Job");

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiters only)
exports.createJob = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Check if user is a recruiter
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create a job",
      });
    }

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all jobs for logged in user
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res) => {
  try {
    // Only get jobs created by the logged-in user
    const jobs = await Job.find({ createdBy: req.user.id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure user owns the job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this job",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error.message);
    // If invalid ObjectId is passed, it will throw a CastError
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure user owns the job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error updating job:", error.message);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure user owns the job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting job:", error.message);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
