const API_URL = import.meta.env.VITE_API_URL;

export async function fetchData(endpoint) {
  const res = await fetch(`${API_URL}/${endpoint}`);
  return res.json();
}

export function createPageUrl(pageName) {
  const pageMap = {
    'Dashboard': '/dashboard',
    'AIChat': '/ai-chat',
    'Meditations': '/meditations',
    'Community': '/community',
    'Login': '/login',
    'SignUp': '/signup',
    'Register': '/signup'
  };
  return pageMap[pageName] || '/dashboard';
}