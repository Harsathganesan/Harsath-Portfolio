import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Portfolio from '../models/Portfolio.js';

const router = express.Router();
const localDataPath = path.resolve('server/local_db.json');

// GET /api/portfolio/health - Backend & MongoDB Atlas Connection Health Check
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  try {
    if (dbState === 1) {
      await Portfolio.findOne().select('_id').lean();
    }
    const responseTime = Date.now() - startTime;
    res.json({
      status: dbState === 1 ? 'online' : 'offline',
      dbState: stateMap[dbState] || 'Unknown',
      responseTime: `${responseTime}ms`,
      database: 'MongoDB Atlas',
      cluster: 'cluster0.hw2qv5l.mongodb.net/portfolio_db',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      dbState: 'Error',
      error: error.message
    });
  }
});

const SEED_DATA = {
  profile: {
    name: "Harsath",
    role: "Software developer",
    tagline: "I build modern, responsive, and high-performance web applications with clean code and intuitive user experiences. Passionate about creating innovative software solutions that solve real-world problems.",
    photo: "/harsath_photo.png",
    resumeUrl: "/G.Harsath Resume.pdf",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "harsath137@gmail.com",
      phone: "+91 6382245266",
      location: "Pudukkottai, Tamil Nadu, India"
    }
  },
  about: {
    bio: "I am a passionate software developer specializing in building modern web applications. With a strong foundation in both front-end aesthetics and back-end logic, I enjoy turning complex problems into elegant, user-friendly digital experiences.",
    education: [
      {
        id: "edu-1",
        degree: "Bachelor of Technology in Information Technology",
        institution: "Anna University",
        period: "2022 - 2026",
        grade: "CGPA: 8.9 / 10"
      },
      {
        id: "edu-2",
        degree: "Higher Secondary Certificate (HSC)",
        institution: "St. Joseph Academy",
        period: "2020 - 2022",
        grade: "Score: 95%"
      }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Full-Stack Web Intern",
        company: "NextGen Software Tech",
        period: "June 2025 - Present",
        description: "Developing scalable React apps and integrating PostgreSQL database endpoints. Improved frontend search latency by 30%."
      },
      {
        id: "exp-2",
        role: "Frontend Development Assistant",
        company: "Freelance / Open Source",
        period: "Jan 2024 - May 2025",
        description: "Designed glassmorphic components, managed global React contexts, and built landing pages for startup clients."
      }
    ]
  },
  skills: {
    frontend: ["HTML5 / CSS3", "JavaScript (ES6+)", "React.js", "Redux Toolkit", "Vanilla CSS"],
    backend: ["Node.js", "Express.js", "REST APIs", "JSON Web Tokens (JWT)"],
    database: ["MongoDB", "PostgreSQL", "Redis"],
    tools: ["Git & GitHub", "Docker", "Vite", "Figma", "Postman", "npm / Yarn"]
  },
  projects: [
    {
      id: "proj-1",
      title: "Nova E-Commerce Suite",
      description: "A dark-themed glassmorphism e-commerce client featuring cart systems, checkout mockups, and smooth layout transitions.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600",
      tags: ["React", "Context API", "CSS Modules"],
      githubLink: "https://github.com",
      liveLink: "https://example.com"
    },
    {
      id: "proj-2",
      title: "Apex Analytics Dashboard",
      description: "Real-time analytics engine tracking user sessions, custom page flows, and live server logs using high-performance SVG chart lines.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      tags: ["React", "Charts.js", "WebSockets"],
      githubLink: "https://github.com",
      liveLink: "https://example.com"
    },
    {
      id: "proj-3",
      title: "Nebula Crypt Chat",
      description: "Secure workspace messaging service styled with gradient bubbles, drag-and-drop file inputs, and fully responsive layouts.",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=600",
      tags: ["React", "Express.js", "Socket.io"],
      githubLink: "https://github.com",
      liveLink: "https://example.com"
    },
    {
      id: "proj-4",
      title: "Clarity Task Planner",
      description: "Minimalist Kanban task manager with smooth drag-drop list animations, labels, and local database recovery options.",
      image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f9c?auto=format&fit=crop&q=80&w=600",
      tags: ["React", "Drag-and-Drop", "Local Storage"],
      githubLink: "https://github.com",
      liveLink: "https://example.com"
    }
  ],
  awards: [
    {
      id: "award-1",
      title: "Full Stack Web Development Certification",
      issuer: "Coursera / Meta",
      year: "2025",
      description: "Completed professional certification covering React, Node.js, Express, databases, and deployment pipelines.",
      credentialUrl: "https://coursera.org",
      badges: ["React", "Node.js", "REST API", "Database"]
    },
    {
      id: "award-2",
      title: "Hackathon Winner - 2nd Place",
      issuer: "TechFest 2026",
      year: "2026",
      description: "Awarded 2nd Place in the Web Design Competition demonstrating creativity and proficiency in web design and user interface development.",
      credentialUrl: "https://example.com",
      badges: ["Frontend", "UI Design", "Innovation"]
    }
  ]
};

// GET portfolio data from MongoDB or local backup
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        portfolio = new Portfolio(SEED_DATA);
        await portfolio.save();
      }
      return res.status(200).json(portfolio);
    }
  } catch (error) {
    console.warn('MongoDB query warning, using local file backup:', error.message);
  }

  // Fallback to local JSON file
  if (fs.existsSync(localDataPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
      return res.status(200).json(fileData);
    } catch (e) {}
  }

  // Auto-initialize local backup file if it doesn't exist
  try {
    fs.writeFileSync(localDataPath, JSON.stringify(SEED_DATA, null, 2));
  } catch (e) {}

  res.status(200).json(SEED_DATA);
});

// PUT update portfolio data in MongoDB and local backup
router.put('/', async (req, res) => {
  const updatedData = req.body;
  
  // Save to local backup file if filesystem is writable
  try {
    fs.writeFileSync(localDataPath, JSON.stringify(updatedData, null, 2));
  } catch (e) {
    console.warn('Local file backup save skipped (Read-only environment):', e.message);
  }

  // Save to MongoDB Atlas if connected
  try {
    if (mongoose.connection.readyState === 1) {
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        portfolio = new Portfolio(updatedData);
      } else {
        portfolio.profile = updatedData.profile || portfolio.profile;
        portfolio.about = updatedData.about || portfolio.about;
        portfolio.skills = updatedData.skills || portfolio.skills;
        portfolio.projects = updatedData.projects || portfolio.projects;
        portfolio.awards = updatedData.awards || portfolio.awards;
      }
      await portfolio.save();
      return res.json(portfolio);
    }
  } catch (error) {
    console.warn('Could not sync to MongoDB Atlas, saved to local server file:', error.message);
  }

  res.json(updatedData);
});

// POST seed initial portfolio data into MongoDB
router.post('/seed', async (req, res) => {
  try {
    const seedData = req.body;
    await Portfolio.deleteMany({});
    const portfolio = new Portfolio(seedData);
    await portfolio.save();
    res.json({ message: 'Portfolio database seeded successfully!', portfolio });
  } catch (error) {
    console.error('Error seeding portfolio in MongoDB:', error);
    res.status(500).json({ error: 'Server error seeding portfolio data' });
  }
});

export default router;
