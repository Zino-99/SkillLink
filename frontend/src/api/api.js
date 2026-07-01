const BASE_URL = 'http://localhost:8000/api';

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
export const logout = () => request('POST', '/logout');
export const me = () => request('GET', '/me');

// Skills
export const getSkills = () => request('GET', '/skills/');
export const createSkill = (data) => request('POST', '/skills/', data);
export const deleteSkill = (id) => request('DELETE', `/skills/${id}`);
// Exchanges
export const createExchange = (skill_id, receiver_id) => request('POST', '/exchanges/', { skill_id, receiver_id });