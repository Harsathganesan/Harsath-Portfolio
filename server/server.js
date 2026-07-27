import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolioRoutes.js';
import Portfolio from './models/Portfolio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Base route check
app.get('/', (req, res) => {
  res.send('Portfolio MongoDB Backend API Server Running');
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
      title: "TaskFlow Pro",
      description: "Kanban-style project management dashboard with real-time drag-and-drop features and team activity feeds.",
      tags: ["React", "Node.js", "MongoDB", "Tailwind"],
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
      githubLink: "https://github.com",
      liveLink: "https://example.com"
    },
    {
      id: "proj-2",
      title: "EduPulse LMS",
      description: "Comprehensive Learning Management System with video streaming, quiz engine, and progress analytics.",
      tags: ["React", "Express", "MySQL", "Chart.js"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      githubLink: "https://github.com",
      liveLink: "https://example.com"
    },
    {
      id: "proj-3",
      title: "DevMetrics API",
      description: "Developer productivity tracking API service with automated github commit parsing and metrics dashboard.",
      tags: ["Node.js", "PostgreSQL", "Docker", "Redis"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
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

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI && !MONGODB_URI.includes('<username>')) {
  const connectWithRetry = () => {
    console.log('Connecting to MongoDB Atlas...');
    mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
      .then(async () => {
        console.log('Successfully connected to MongoDB Atlas!');
        const count = await Portfolio.countDocuments();
        if (count === 0) {
          console.log('Seeding initial portfolio data into MongoDB Atlas...');
          await Portfolio.create(SEED_DATA);
          console.log('MongoDB Atlas seeded successfully!');
        }
      })
      .catch((err) => {
        console.error('MongoDB Atlas Connection Error:', err.message);
        console.log('Retrying MongoDB connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
      });
  };

  connectWithRetry();

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB Atlas disconnected! Attempting reconnect...');
    connectWithRetry();
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
} else {
  console.log('MongoDB URI placeholder detected in .env file. Please update MONGODB_URI in .env with your connection string.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
