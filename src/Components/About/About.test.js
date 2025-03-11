import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import About from './About';

describe('About', () => {
    it('shows About', async () => {
        render(<About />);

        expect(screen.getByRole('heading'))
         .toHaveTextContent('About Us')

    });
});
