import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  profile: {
    name: { type: String, default: 'Harsath' },
    role: { type: String, default: 'Software developer' },
    tagline: { type: String, default: 'I build modern, responsive, and high-performance web applications with clean code and intuitive user experiences. Passionate about creating innovative software solutions that solve real-world problems.' },
    photo: { type: String, default: '/harsath_photo.png' },
    resumeUrl: { type: String, default: '/G.Harsath Resume.pdf' },
    socials: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      email: { type: String, default: 'harsath137@gmail.com' },
      phone: { type: String, default: '+91 6382245266' },
      location: { type: String, default: 'Pudukkottai, Tamil Nadu, India' }
    }
  },
  about: {
    bio: { type: String, default: '' },
    education: [{
      id: String,
      institution: String,
      degree: String,
      period: String,
      year: String,
      grade: String,
      score: String
    }],
    experience: [{
      id: String,
      role: String,
      company: String,
      period: String,
      description: String,
      highlights: [String]
    }]
  },
  skills: {
    frontend: [String],
    backend: [String],
    database: [String],
    tools: [String]
  },
  projects: [{
    id: String,
    title: String,
    description: String,
    tags: [String],
    image: String,
    githubLink: String,
    liveLink: String
  }],
  awards: [{
    id: String,
    title: String,
    issuer: String,
    date: String,
    year: String,
    description: String,
    credentialUrl: String,
    badges: [String]
  }]
}, { timestamps: true, strict: false });

export default mongoose.model('Portfolio', PortfolioSchema);
