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
      title: "2nd Place - Web Design Competition",
      issuer: "Hindustan College of Arts and Science",
      date: "2026",
      description: "Awarded 2nd Place in the Web Design Competition demonstrating creativity and proficiency in web design and user interface development."
    }
  ]
};

const STORAGE_KEY = "portfolio_database_v1";

export const getPortfolioData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  try {
    const parsed = JSON.parse(data);
    if (!parsed.awards) {
      parsed.awards = [...SEED_DATA.awards];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error("Error parsing portfolio database, resetting to default.", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
};

const API_URL = import.meta.env.VITE_API_URL || '/api/portfolio';

export const checkBackendConnection = async () => {
  const API_HEALTH = `${API_URL}/health`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(API_HEALTH, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    clearTimeout(timeoutId);
  }
  return {
    status: 'offline',
    dbState: 'Disconnected',
    responseTime: 'N/A',
    database: 'Local Storage Cache',
    cluster: 'Offline'
  };
};

export const fetchPortfolioFromDB = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.profile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('MongoDB API server fetch timeout or offline, using local database cache.');
  }
  return getPortfolioData();
};

export const savePortfolioToDB = async (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const saved = await res.json();
      return saved;
    }
  } catch (error) {
    console.warn('Could not sync save to MongoDB API server, saved to local cache.');
  }
  return data;
};

export const savePortfolioData = (data) => {
  savePortfolioToDB(data);
};

export const resetPortfolioData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  savePortfolioToDB(SEED_DATA);
  return SEED_DATA;
};
