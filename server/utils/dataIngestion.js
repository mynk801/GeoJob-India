const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Job = require('../models/Job');

// Adzuna API config
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;
const COUNTRY = 'in'; // India
const RESULTS_PER_PAGE = 50;
const QUERIES = ['junior software', 'fresher software', 'trainee developer', 'entry level engineer', 'graduate software'];
const PAGES_PER_QUERY = 3;

const fetchJobsFromAdzuna = async () => {
  if (!APP_ID || !APP_KEY) {
    console.error('Error: ADZUNA_APP_ID and ADZUNA_APP_KEY must be set in your server/.env file.');
    console.error('Sign up for free at: https://developer.adzuna.com/');
    process.exit(1);
  }

  try {
    let allResults = [];
    console.log(`Fetching maximum fresher data from Adzuna API...`);
    
    for (const query of QUERIES) {
      console.log(`Searching for: "${query}"...`);
      for (let page = 1; page <= PAGES_PER_QUERY; page++) {
        const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/${page}`;
        const response = await axios.get(url, {
          params: {
            app_id: APP_ID,
            app_key: APP_KEY,
            results_per_page: RESULTS_PER_PAGE,
            what: query
          },
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.data.results && response.data.results.length > 0) {
          allResults = allResults.concat(response.data.results);
        } else {
          // No more results for this query, break page loop
          break;
        }
      }
    }

    // Deduplicate by job id (Adzuna provides 'id')
    const uniqueJobsMap = new Map();
    for (const job of allResults) {
      if (!uniqueJobsMap.has(job.id)) {
        uniqueJobsMap.set(job.id, job);
      }
    }
    const uniqueResults = Array.from(uniqueJobsMap.values());

    console.log(`Fetched a total of ${uniqueResults.length} unique fresher jobs.`);
    return uniqueResults;

  } catch (error) {
    if (error.response) {
      console.error('Error fetching from Adzuna API:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching from Adzuna:', error.message);
    }
    throw error;
  }
};

const normalizeData = (adzunaJobs) => {
  return adzunaJobs.map(job => {
    // Attempt to extract tech tags from description/title
    const text = (job.title + ' ' + job.description).toLowerCase();
    const possibleTags = ['react', 'node', 'java', 'python', 'c++', 'javascript', 'aws', 'sql', 'angular', 'vue', 'mongodb', 'docker', 'kubernetes', 'typescript'];
    const tags = possibleTags.filter(tag => text.includes(tag));
    
    // Validate coordinates, fallback to Center of India if API doesn't provide them
    // Note: Mongoose GeoJSON requires [longitude, latitude]
    let lng = 78.9629;
    let lat = 20.5937;
    
    if (job.longitude && job.latitude) {
        lng = parseFloat(job.longitude);
        lat = parseFloat(job.latitude);
    }

    // Heuristically assign experience level based on job title/description
    let exp = '3';
    if (text.match(/\b(senior|lead|manager|architect|principal|expert|experienced|director)\b/)) {
      exp = '5';
    } else if (text.match(/\b(junior|fresher|entry|trainee|graduate|intern|0-2|1 year)\b/)) {
      exp = '0';
    }

    return {
      title: job.title ? job.title.replace(/<\/?[^>]+(>|$)/g, "") : 'Unknown Title',
      company: (job.company && job.company.display_name) ? job.company.display_name : 'Unknown Company',
      location: (job.location && job.location.display_name) ? job.location.display_name : 'India',
      coordinates: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      description: job.description.substring(0, 400) + '...',
      experience_level: exp,
      source_platform: 'Adzuna',
      apply_url: job.redirect_url,
      posted_date: new Date(job.created),
      tags: tags.length > 0 ? tags : ['Software Engineer'],
    };
  });
};

const ingestData = async (isCron = false) => {
  try {
    if (!isCron) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/geojob_india');
    }
    
    const rawJobs = await fetchJobsFromAdzuna();
    const formattedJobs = normalizeData(rawJobs);

    console.log('Clearing all existing jobs (removing dummy data)...');
    await Job.deleteMany({});

    console.log('Inserting new jobs into MongoDB...');
    await Job.insertMany(formattedJobs);
    
    console.log('Data Ingestion Complete! Your data lake has been populated.');
    if (!isCron) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Ingestion failed:', error);
    if (!isCron) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  ingestData(false);
}

module.exports = ingestData;
