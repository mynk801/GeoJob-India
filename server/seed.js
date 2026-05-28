const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');

const MOCK_JOBS = [
  {
    title: 'Full Stack Engineer',
    company: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    coordinates: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // [lng, lat]
    },
    description: 'Looking for a skilled MERN stack developer to build scalable applications.',
    experience_level: '3-5',
    source_platform: 'LinkedIn',
    tags: ['MERN', 'React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Backend Developer (Java)',
    company: 'FinTech Solutions',
    location: 'Hyderabad, Telangana',
    coordinates: {
      type: 'Point',
      coordinates: [78.4867, 17.3850]
    },
    description: 'Join our core payments team. Strong Java and Spring Boot experience required.',
    experience_level: '0-2',
    source_platform: 'Naukri',
    tags: ['Java', 'Spring Boot', 'AWS'],
  },
  {
    title: 'Frontend Engineer',
    company: 'StartupX',
    location: 'Pune, Maharashtra',
    coordinates: {
      type: 'Point',
      coordinates: [73.8567, 18.5204]
    },
    description: 'Create beautiful user interfaces using React and Tailwind CSS.',
    experience_level: '0-2',
    source_platform: 'AngelList',
    tags: ['React', 'JavaScript', 'CSS', 'Frontend'],
  },
  {
    title: 'Software Engineer - C++',
    company: 'Gaming Studios',
    location: 'Gurgaon, Haryana',
    coordinates: {
      type: 'Point',
      coordinates: [77.0266, 28.4595]
    },
    description: 'Develop high-performance rendering engines. Strong C++ fundamentals required.',
    experience_level: '5+',
    source_platform: 'LinkedIn',
    tags: ['C++', 'OpenGL', 'Software Engineer'],
  },
  {
    title: 'Data Scientist',
    company: 'Analytics India',
    location: 'Chennai, Tamil Nadu',
    coordinates: {
      type: 'Point',
      coordinates: [80.2707, 13.0827]
    },
    description: 'Seeking a Data Scientist proficient in Python and machine learning frameworks.',
    experience_level: '3-5',
    source_platform: 'Indeed',
    tags: ['Python', 'Machine Learning', 'Data Scientist'],
  },
  {
    title: 'Cloud DevOps Engineer',
    company: 'CloudWorks',
    location: 'Bangalore, Karnataka',
    coordinates: {
      type: 'Point',
      coordinates: [77.6250, 12.9250] // Slightly different part of Bangalore
    },
    description: 'Manage our AWS infrastructure and CI/CD pipelines.',
    experience_level: '3-5',
    source_platform: 'LinkedIn',
    tags: ['AWS', 'DevOps', 'Python'],
  },
  {
    title: 'Junior Software Engineer',
    company: 'EduTech Corp',
    location: 'Hyderabad, Telangana',
    coordinates: {
      type: 'Point',
      coordinates: [78.3811, 17.4483] // HITEC City
    },
    description: 'Great opportunity for freshers! Learn and build with modern tech stacks.',
    experience_level: '0',
    source_platform: 'Naukri',
    tags: ['Java', 'React', 'Full-Stack'],
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/geojob_india');
    
    console.log('Clearing existing jobs...');
    await Job.deleteMany({});
    
    console.log('Inserting mock jobs...');
    await Job.insertMany(MOCK_JOBS);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
