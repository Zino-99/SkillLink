import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Onboarding from '../pages/user/Onboarding';

vi.mock('../api/api', () => ({
  createSkill: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('Onboarding', () => {
  it('affiche le titre', () => {
    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );
    expect(screen.getByText('Ajoutez vos compétences')).toBeInTheDocument();
  });

  it('le bouton Terminer est désactivé sans compétence', () => {
    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );
    const button = screen.getByText("Terminer l'inscription");
    expect(button).toBeDisabled();
  });

  it('affiche le message quand aucune compétence ajoutée', () => {
    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );
    expect(screen.getByText('Ajoutez au moins une compétence pour continuer')).toBeInTheDocument();
  });

  it('affiche le formulaire avec les bons champs', () => {
    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('React')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Développement web')).toBeInTheDocument();
  });
});