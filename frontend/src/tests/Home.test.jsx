import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/user/Home';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

describe('Home', () => {
  it('affiche le titre SkillLink', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('SkillLink')).toBeInTheDocument();
  });

  it('affiche les boutons Connexion et Inscription', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });
});