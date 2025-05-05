import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App';

beforeEach(() => {
  localStorage.setItem('email', 'anna_test_ed@nyu.edu');
  localStorage.setItem('username', 'anna_test_ed');
  localStorage.setItem('userRoles', JSON.stringify(['ED']));
});

describe('App', () => {
  it('renders nav and home', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: /jaxs/i });  // fixed
    expect(screen.getByRole('heading', { name: /jaxs/i }))
      .toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(7);
  });

  it('switches to People view', async () => {
    render(<App />);
    userEvent.click(screen.getByText('People'));
    expect(screen.getByRole('heading', { name: /view all people/i }))
      .toBeInTheDocument();
  });

  it('switches Login page', async () => {
    render(<App />);
    userEvent.click(screen.getByText('Profile'));
    expect(screen.getByRole('heading', { name: /profile page/i }))  // fixed
      .toBeInTheDocument();
  });

  it('switches Guidelines page', async () => {
    render(<App />);
    userEvent.click(screen.getByText('Submissions'));
    expect(screen.getByRole('heading', { name: /submission guide/i }))
      .toBeInTheDocument();
  });

  it('switches Masthead page', async () => {
    render(<App />);
    userEvent.click(screen.getByText('Masthead'));
    expect(screen.getByRole('heading', { name: /journal masthead/i }))
      .toBeInTheDocument();
  });

  it('switches About page', async () => {
    render(<App />);
    userEvent.click(screen.getByText('About'));
    expect(screen.getByRole('heading', { name: /about us/i }))
      .toBeInTheDocument();
  });
});
