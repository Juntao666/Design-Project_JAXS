import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import Login from './Login';

describe('Login component', () => {
  it('shows correct login form', async () => {
    render(
      <BrowserRouter>
        <Login onLogin={() => {}} onLogout={() => {}} />
      </BrowserRouter>
    );

    await screen.findAllByRole('textbox');

    expect(screen.getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
