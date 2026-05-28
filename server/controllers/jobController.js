const Job = require('../models/Job');

// @desc    Get jobs based on filters (tech stack, experience, geospatial)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { tech, role, experience, lat, lng, radius, sort } = req.query;
    
    // Build the query object
    const query = {};

    // 1. Text search on tech tags if provided
    if (tech) {
      const techArray = tech.split(',').map(t => t.trim());
      // Find jobs where tags match any of the provided tech stack items (case-insensitive)
      query.tags = { $in: techArray.map(t => new RegExp(`^${t}$`, 'i')) }; 
    }

    // 2. Role filter (search in title)
    if (role) {
      const roleArray = role.split(',').map(r => r.trim());
      // Create regexes to match any of the roles in the title
      query.title = { $in: roleArray.map(r => new RegExp(r, 'i')) };
    }

    // 3. Experience Level filter
    if (experience) {
      // Support multiple experience ranges e.g. "0-2,3-5"
      const expArray = experience.split(',').map(e => e.trim());
      query.experience_level = { $in: expArray };
    }

    // 4. Geospatial query if lat, lng and radius (in km) are provided
    if (lat && lng && radius) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON is [longitude, latitude]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    }

    let jobsQuery = Job.find(query);
    
    // Sort logic
    if (sort === 'oldest') {
      jobsQuery = jobsQuery.sort({ posted_date: 1 });
    } else if (sort === 'newest') {
      jobsQuery = jobsQuery.sort({ posted_date: -1 });
    } else if (!lat || !lng) {
      // Default to newest if no specific geospatial sort is applied 
      jobsQuery = jobsQuery.sort({ posted_date: -1 });
    }

    const jobs = await jobsQuery;
    res.status(200).json(jobs);

  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getJobs,
};
