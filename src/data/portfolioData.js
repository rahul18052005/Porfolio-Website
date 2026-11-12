// Centralized portfolio data extracted directly from Rahul Hor's latest resume
// and prompt specifications. All external URLs are verified or cleanly configurable.

export const PROFILE = {
  name: 'RAHUL HOR',
  shortName: 'Rahul Hor',
  role: 'AI/ML Engineer & Software Engineer',
  availability: 'Available for opportunities',
  email: 'rahulhor2024@gmail.com',
  phone: '+91 93395 22029',
  phoneHref: 'tel:+919339522029',
  location: 'Purba Bardhaman, West Bengal, India',
  resumePdfPath: '/Rahul_Hor_Resume.pdf',
  socials: {
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/rahul-hor-165709361/',
    github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/rahul18052005',
    leetcode: import.meta.env.VITE_LEETCODE_URL || 'https://leetcode.com/u/rahul794/',
  },
  // Optional Formspree or custom webhook endpoint for direct form submissions
  contactFormEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
};

export const HERO_CONTENT = {
  headlineSerif: 'Intelligent',
  headlineCondensed: 'ENGINEER.',
  supportingLine: 'Building the future through intelligence, creativity and code.',
  introPrimary: "Hi, I'm Rahul Hor, an aspiring AI/ML Engineer and Software Engineer.",
  introSecondary:
    'I explore Machine Learning, Deep Learning, Generative AI, RAG, Agentic AI and modern software development to build intelligent applications.',
};

export const NAV_LINKS = [
  { id: 'hero', label: 'Home', index: '01' },
  { id: 'about', label: 'About', index: '02' },
  { id: 'expertise', label: 'Expertise', index: '03' },
  { id: 'projects', label: 'Projects', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
];

export const ABOUT_CONTENT = {
  headline: 'BEYOND THE ALGORITHM.',
  paragraphs: [
    "I'm Rahul Hor, a Computer Science Engineering student specializing in Data Science. I'm passionate about Artificial Intelligence, Machine Learning, Generative AI, Agentic AI and Software Engineering.",
    'I enjoy building intelligent applications, exploring emerging technologies and solving challenging engineering problems.',
    'My goal is to develop practical AI-powered solutions that create meaningful real-world impact.',
  ],
  highlights: [
    {
      id: 'dsa',
      metric: '200+',
      label: 'DSA Problems Solved',
      detail: 'Across arrays, strings, sorting, recursion, binary search, trees and core algorithms on LeetCode.',
    },
    {
      id: 'projects',
      metric: '4+',
      label: 'AI-Based Projects',
      detail: 'Spanning Machine Learning, NLP, Computer Vision, Generative AI and Agentic AI.',
    },
    {
      id: 'degree',
      metric: 'B.Tech',
      label: 'Computer Science Engineering',
      detail: 'Specializing in Data Science at Brainware University, Barasat (Aug 2023 – Present).',
    },
    {
      id: 'samsung',
      metric: 'Certified',
      label: 'Samsung Innovation Campus',
      detail: 'Completed certified AI/ML training under Samsung Innovation Campus.',
    },
  ],
};

// Exact skills from Rahul Hor's resume — intentionally no invented percentages or ratings.
export const SKILL_CATEGORIES = [
  {
    id: 'all',
    label: 'All Systems',
    shortLabel: 'ALL',
    accent: '#00f0ff',
    description: 'Complete constellation across AI/ML, Generative AI, Agentic workflows, and full-stack software engineering.',
    skills: [],
  },
  {
    id: 'languages',
    label: 'Programming Languages',
    shortLabel: 'LANG',
    accent: '#00f0ff',
    description: 'Core algorithmic, backend, data-science, and web programming foundations.',
    skills: ['Python', 'Java', 'JavaScript', 'SQL'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    shortLabel: 'UI',
    accent: '#2dd4bf',
    description: 'Responsive, high-craft client interfaces and reactive UI systems.',
    skills: ['HTML5', 'CSS3', 'React.js', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    label: 'Backend',
    shortLabel: 'API',
    accent: '#38bdf8',
    description: 'Asynchronous APIs, model serving layers, and microservice architectures.',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'Flask', 'REST APIs'],
  },
  {
    id: 'databases',
    label: 'Databases',
    shortLabel: 'DATA',
    accent: '#a78bfa',
    description: 'Relational, document, cloud Postgres, and semantic vector stores.',
    skills: ['MongoDB', 'MySQL', 'Supabase', 'ChromaDB'],
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    shortLabel: 'ML',
    accent: '#00f0ff',
    description: 'Classical predictive modeling, feature pipelines, and rigorous evaluation.',
    skills: [
      'Scikit-learn',
      'XGBoost',
      'Supervised Learning',
      'Unsupervised Learning',
      'Feature Engineering',
      'Model Evaluation',
    ],
  },
  {
    id: 'dl',
    label: 'Deep Learning',
    shortLabel: 'DL',
    accent: '#ec4899',
    description: 'Multi-layer architectures, convolutional networks, and neural training frameworks.',
    skills: ['Neural Networks', 'CNN', 'TensorFlow', 'PyTorch'],
  },
  {
    id: 'genai',
    label: 'Generative AI',
    shortLabel: 'GENAI',
    accent: '#2dd4bf',
    description: 'Retrieval-augmented pipelines, semantic embeddings, orchestration, and safety.',
    skills: [
      'LLMs',
      'Prompt Engineering',
      'Embeddings',
      'RAG',
      'LangChain',
      'Vector Databases',
      'Guardrails',
    ],
  },
  {
    id: 'agentic',
    label: 'Agentic AI',
    shortLabel: 'AGENTS',
    accent: '#ec4899',
    description: 'Autonomous stateful reasoning graphs, tool integration, and multi-agent coordination.',
    skills: [
      'AI Agents',
      'LangGraph',
      'CrewAI',
      'Multi-Agent Systems',
      'Tool Calling',
      'MCP',
      'Function Calling',
      'Agent Evaluations',
    ],
  },
  {
    id: 'nlp-cv',
    label: 'NLP & Computer Vision',
    shortLabel: 'NLP/CV',
    accent: '#38bdf8',
    description: 'Semantic text intelligence, pose landmark estimation, and real-time visual analysis.',
    skills: ['NLP', 'TF-IDF', 'Semantic Search', 'OpenCV', 'MediaPipe', 'Face Recognition'],
  },
  {
    id: 'mlops',
    label: 'MLOps & Deployment',
    shortLabel: 'MLOPS',
    accent: '#a78bfa',
    description: 'Containerization, experiment tracking, cloud delivery, and automated deployment pipelines.',
    skills: ['AWS', 'Docker', 'MLflow', 'CI/CD', 'Model Deployment', 'Model Monitoring', 'Streamlit'],
  },
  {
    id: 'tools',
    label: 'Tools & DevOps',
    shortLabel: 'TOOLS',
    accent: '#f4f6fa',
    description: 'Version control, experimentation environments, and daily engineering workspace.',
    skills: ['Git', 'GitHub', 'Jupyter Notebook', 'VS Code'],
  },
];

export const PROJECTS = [
  {
    id: 'ats-system',
    index: '01',
    code: 'PRJ // 01',
    title: 'AI RESUME ATS SYSTEM',
    shortTitle: 'ATS System',
    subtitle: 'Semantic Document Intelligence & RAG Evaluation Engine',
    technologies: ['NLP', 'GenAI', 'RAG', 'React', 'FastAPI'],
    description:
      'Built an AI-powered ATS system to analyze resumes against job descriptions using NLP, embeddings and semantic similarity.',
    features: [
      'LLM-powered resume evaluation.',
      'RAG integration.',
      'Resume scoring.',
      'Skill-gap analysis.',
      'Personalized improvement suggestions.',
      'React frontend and FastAPI backend.',
    ],
    visualTheme: {
      name: 'Holographic Document Scanner',
      primaryColor: '#00f0ff',
      secondaryColor: '#f4f6fa',
      modeLabel: 'SEMANTIC SCAN MATRIX',
    },
    links: {
      github: import.meta.env.VITE_PROJECT_ATS_GITHUB || 'https://github.com/rahul18052005/ATS-Analyzer',
      liveDemo: import.meta.env.VITE_PROJECT_ATS_DEMO || null,
    },
  },
  {
    id: 'web-chatbot',
    index: '02',
    code: 'PRJ // 02',
    title: 'AI CHATBOT WITH WEB SEARCH',
    shortTitle: 'Agentic Chatbot',
    subtitle: 'Stateful LangGraph Agent with Real-Time Web Grounding',
    technologies: ['Python', 'LangGraph', 'Streamlit', 'LLM'],
    description:
      'Developed an Agentic AI chatbot using Python, LangGraph and LLMs.',
    features: [
      'Web Search integration for real-time information retrieval.',
      'Accurate information retrieval and responses.',
      'Interactive Streamlit-based interface.',
      'Dynamic query handling.',
      'Web-powered responses.',
    ],
    visualTheme: {
      name: 'Agentic Intelligence Lattice',
      primaryColor: '#ec4899',
      secondaryColor: '#00f0ff',
      modeLabel: 'LANGGRAPH NEURAL WEB',
    },
    links: {
      github: import.meta.env.VITE_PROJECT_CHATBOT_GITHUB || 'https://github.com/rahul18052005/Agentic-Chatbot',
      liveDemo: import.meta.env.VITE_PROJECT_CHATBOT_DEMO || null,
    },
  },
  {
    id: 'gym-trainer',
    index: '03',
    code: 'PRJ // 03',
    title: 'AI GYM TRAINER',
    shortTitle: 'AI Gym Trainer',
    subtitle: 'Real-Time Pose Estimation & Biomechanical Form Coach',
    technologies: ['Computer Vision', 'MediaPipe', 'OpenCV'],
    description:
      'Built an AI-powered fitness trainer using MediaPipe pose estimation for real-time exercise tracking.',
    features: [
      'Real-time exercise tracking.',
      'Movement and posture analysis.',
      'Incorrect exercise form detection.',
      'Repetition tracking.',
      'Real-time corrective feedback.',
    ],
    visualTheme: {
      name: 'Biomechanical Pose Telemetry',
      primaryColor: '#2dd4bf',
      secondaryColor: '#8b5cf6',
      modeLabel: 'MEDIAPIPE POSE RIG',
    },
    links: {
      github: import.meta.env.VITE_PROJECT_GYM_GITHUB || 'https://github.com/rahul18052005/AI-GYM-COACH',
      liveDemo: import.meta.env.VITE_PROJECT_GYM_DEMO || null,
    },
  },
];

export const EDUCATION = [
  {
    id: 'brainware',
    institution: 'Brainware University, Barasat',
    degree: 'B.Tech in Computer Science Engineering (Data Science)',
    period: 'August 2023 – Present',
    scoreLabel: 'CGPA',
    scoreValue: '7.8 / 10',
    status: 'IN PROGRESS',
    focus: 'Specializing in Data Science, Machine Learning, Deep Learning, Generative AI, and Full-Stack Software Systems.',
  },
  {
    id: 'seharabazar',
    institution: 'Sehara Bazar C.K. Institution',
    degree: 'Higher Secondary (XII), WBCHSE',
    period: 'April 2021 – March 2023',
    scoreLabel: 'Percentage',
    scoreValue: '74.8%',
    status: 'COMPLETED',
    focus: 'Foundational concentration in Mathematics, Physics, and analytical problem solving.',
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'sic',
    tag: 'CERTIFICATION // 01',
    title: 'Samsung Innovation Campus',
    headline: 'Completed certified AI/ML training under Samsung Innovation Campus.',
    link: null,
    linkLabel: null,
  },
  {
    id: 'leetcode',
    tag: 'ALGORITHMS // 02',
    title: '200+ DSA Problems Solved',
    headline:
      'Solved 200+ DSA problems across arrays, strings, sorting, recursion, binary search, trees and other topics on LeetCode.',
    link: 'https://leetcode.com/u/rahul794/',
    linkLabel: 'View LeetCode Profile',
  },
  {
    id: 'ai-builds',
    tag: 'ENGINEERING // 03',
    title: '4+ AI-Based Projects',
    headline:
      'Built 4+ AI-based projects spanning Machine Learning, NLP, Computer Vision, Generative AI and Agentic AI.',
    link: 'https://github.com/rahul18052005',
    linkLabel: 'Explore GitHub Repositories',
  },
];

export const COURSES_AND_LANGUAGES = {
  courses: [
    'Complete Python Bootcamp (Online Course)',
    'MERN Stack Development (Apna College)',
    'Machine Learning & Artificial Intelligence (Apna College)',
    'Complete Agentic AI Bootcamp (Udemy)',
  ],
  languages: [
    { name: 'English', level: 'Professional Proficiency' },
    { name: 'Hindi', level: 'Native Proficiency' },
    { name: 'Bengali', level: 'Conversational Proficiency' },
  ],
};

