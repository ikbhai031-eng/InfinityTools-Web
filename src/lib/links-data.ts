
export interface ExternalLink {
  id: string;
  name: string;
  url: string;
  category: 'Social' | 'Developer' | 'Productivity' | 'Streaming' | 'Shopping' | 'Reference' | 'Education' | 'Business' | 'Design' | 'Cloud' | 'Health' | 'Travel' | 'News' | 'Services' | 'Entertainment' | 'Finance';
  description: string;
  logoUrl?: string;
}

export const EXTERNAL_LINKS: ExternalLink[] = [
  // Developer Tools
  { id: 'github', name: 'GitHub', url: 'https://github.com', category: 'Developer', description: 'World-leading developer platform.', logoUrl: 'https://logo.clearbit.com/github.com' },
  { id: 'vercel', name: 'Vercel', url: 'https://vercel.com', category: 'Developer', description: 'Frontend deployment and infrastructure.', logoUrl: 'https://logo.clearbit.com/vercel.com' },
  { id: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Developer', description: 'Coding Q&A and technical community.', logoUrl: 'https://logo.clearbit.com/stackoverflow.com' },
  { id: 'postman', name: 'Postman', url: 'https://postman.com', category: 'Developer', description: 'API platform for developers.', logoUrl: 'https://logo.clearbit.com/postman.com' },
  { id: 'docker', name: 'Docker', url: 'https://docker.com', category: 'Developer', description: 'Containerization and app lifecycle platform.', logoUrl: 'https://logo.clearbit.com/docker.com' },
  { id: 'supabase', name: 'Supabase', url: 'https://supabase.com', category: 'Developer', description: 'Open source backend and database infrastructure.', logoUrl: 'https://logo.clearbit.com/supabase.com' },
  { id: 'netlify', name: 'Netlify', url: 'https://netlify.com', category: 'Developer', description: 'The fastest way to deploy web applications.', logoUrl: 'https://logo.clearbit.com/netlify.com' },

  // Productivity
  { id: 'slack', name: 'Slack', url: 'https://slack.com', category: 'Productivity', description: 'Business communication and collaboration.', logoUrl: 'https://logo.clearbit.com/slack.com' },
  { id: 'notion', name: 'Notion', url: 'https://notion.so', category: 'Productivity', description: 'Connected workspace for docs and wikis.', logoUrl: 'https://logo.clearbit.com/notion.so' },
  { id: 'trello', name: 'Trello', url: 'https://trello.com', category: 'Productivity', description: 'Visual project management boards.', logoUrl: 'https://logo.clearbit.com/trello.com' },
  { id: 'asana', name: 'Asana', url: 'https://asana.com', category: 'Productivity', description: 'Team collaboration and goal tracking.', logoUrl: 'https://logo.clearbit.com/asana.com' },
  { id: 'zoom', name: 'Zoom', url: 'https://zoom.us', category: 'Productivity', description: 'Enterprise video communications.', logoUrl: 'https://logo.clearbit.com/zoom.us' },

  // Design
  { id: 'figma', name: 'Figma', url: 'https://figma.com', category: 'Design', description: 'Collaborative interface design tool.', logoUrl: 'https://logo.clearbit.com/figma.com' },
  { id: 'canva', name: 'Canva', url: 'https://canva.com', category: 'Design', description: 'Graphic design for everyone.', logoUrl: 'https://logo.clearbit.com/canva.com' },
  { id: 'dribbble', name: 'Dribbble', url: 'https://dribbble.com', category: 'Design', description: 'Discover creative community and inspiration.', logoUrl: 'https://logo.clearbit.com/dribbble.com' },
  { id: 'unsplash', name: 'Unsplash', url: 'https://unsplash.com', category: 'Design', description: 'The internet source for high-quality images.', logoUrl: 'https://logo.clearbit.com/unsplash.com' },

  // Social
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', category: 'Social', description: 'Professional social network.', logoUrl: 'https://logo.clearbit.com/linkedin.com' },
  { id: 'x', name: 'X (Twitter)', url: 'https://x.com', category: 'Social', description: 'Global real-time microblogging.', logoUrl: 'https://logo.clearbit.com/twitter.com' },
  { id: 'reddit', name: 'Reddit', url: 'https://reddit.com', category: 'Social', description: 'The front page of the internet.', logoUrl: 'https://logo.clearbit.com/reddit.com' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', category: 'Social', description: 'World largest video sharing platform.', logoUrl: 'https://logo.clearbit.com/youtube.com' },

  // Finance
  { id: 'bloomberg', name: 'Bloomberg', url: 'https://bloomberg.com', category: 'Finance', description: 'Global business and financial news.', logoUrl: 'https://logo.clearbit.com/bloomberg.com' },
  { id: 'yahoo-finance', name: 'Yahoo Finance', url: 'https://finance.yahoo.com', category: 'Finance', description: 'Stock market data and analysis.', logoUrl: 'https://logo.clearbit.com/yahoo.com' },
  { id: 'revolut', name: 'Revolut', url: 'https://revolut.com', category: 'Finance', description: 'The global financial super app.', logoUrl: 'https://logo.clearbit.com/revolut.com' },

  // Services
  { id: 'fiverr', name: 'Fiverr', url: 'https://fiverr.com', category: 'Services', description: 'Freelance services marketplace.', logoUrl: 'https://logo.clearbit.com/fiverr.com' },
  { id: 'upwork', name: 'Upwork', url: 'https://upwork.com', category: 'Services', description: 'World largest freelance marketplace.', logoUrl: 'https://logo.clearbit.com/upwork.com' },
];
