const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const request = async (method, endpoint, body = null) => {
  const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// Auth
export const register = (nom, email, password) => request('POST', '/register', { nom, email, password });
export const login = (email, password) => request('POST', '/login', { email, password });
export const logout = () => fetch(`${BASE_URL}/logout`, { method: 'POST', credentials: 'include' });
export const me = () => request('GET', '/me');

// Skills
export const getSkills = () => request('GET', '/skills/');
export const createSkill = (data) => request('POST', '/skills/', data);
export const deleteSkill = (id) => request('DELETE', `/skills/${id}`);
// Exchanges
export const createExchange = (skill_id, receiver_id) => request('POST', '/exchanges/', { skill_id, receiver_id });

export const createReport = (reported_id, description) => request('POST', '/reports/', { reported_id, description });


export const createRating = (rated_id, note, commentaire) => request('POST', '/ratings/', { rated_id, note, commentaire });