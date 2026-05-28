const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  description: {
    type: String,
  },
  experience_level: {
    type: String, // e.g., '0-2', '3-5', '5+'
  },
  source_platform: {
    type: String,
  },
  apply_url: {
    type: String,
  },
  posted_date: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
  },
}, { timestamps: true });

// Add a 2dsphere index on coordinates for geospatial queries
jobSchema.index({ coordinates: '2dsphere' });
// Add text indexes on title and tags for text search
jobSchema.index({ title: 'text', tags: 'text' });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
