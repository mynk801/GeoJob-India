const express = require('express');
const router = express.Router();
const { getJobs } = require('../controllers/jobController');

// @route   GET /api/jobs
// @desc    Get jobs based on filters
// @access  Public
router.get('/', getJobs);

module.exports = router;
