export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  year: string;
  description: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  badges?: string[];
  metrics?: string[];
  tags: string[];
}

export interface Service {
  id: string;
  num: string;
  title: string;
  description: string;
  details: string[];
}

export interface Internship {
  id: string;
  num: string;
  company: string;
  role: string;
  duration: string;
  details: string[];
  tags: string[];
}


export interface Insight {
  id: string;
  title: string;
  image: string;
}

export interface ProcessStep {
  id: string;
  num: string;
  title: string;
  description: string;
  details: string[];
  image: string;
  liveUrl?: string;
}
