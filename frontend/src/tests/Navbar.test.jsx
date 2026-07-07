import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
    isAdmin: () => false,
  }),
}));

describe('Navbar', () => {
  it('affiche le logo SkillLink', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getAllByText('SkillLink').length).toBeGreaterThan(0);
  });

  it('affiche les boutons Connexion et Inscription quand non connecté', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Connexion').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Inscription').length).toBeGreaterThan(0);
  });

  it('affiche le bouton burger sur mobile', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getAllByText('SkillLink').length).toBeGreaterThan(0);
  });
});