import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAdmin: () => false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('ProtectedRoute', () => {
  it('redirige vers /login si non connecté', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>Page Login</p>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>Dashboard</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Page Login')).toBeInTheDocument();
  });

  it('affiche le contenu protégé si connecté', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>Page Login</p>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>Dashboard</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Page Login')).toBeInTheDocument();
  });
});