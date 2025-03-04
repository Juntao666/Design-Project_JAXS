import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App';


describe('App', () => {
  it('renders nav and home', async () => {
    render(<App />);

    await screen.findByRole('heading');
    expect(screen.getByRole('heading'))
      .toHaveTextContent('Journal of React');

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('switches to People view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('View All People'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('View All People')
  });

  it('switches Login page', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Login'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('Login')
  });

  it('switches Submissions page', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Submissions'));

//    expect(screen.getByRole('heading'))
//      .toHaveTextContent('Submissions')
  });

  it('switches Guidelines page', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Guidelines'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('Submission Guideline')
  });

  it('switches Masthead page', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Masthead'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('JOURNAL MASTHEAD')
  });

  it('switches About page', async () => {
    render(<App />);

    userEvent.click(screen.getByText('About'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('About Us')
  });
});
  
  
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
