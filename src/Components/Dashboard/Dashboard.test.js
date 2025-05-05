import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import Dashboard from './Dashboard';

describe('Dashboard', () => {
    it('shows Dashboard', async () => {
        render(<Dashboard />);

        expect(screen.getByRole('heading'))
         .toHaveTextContent('Manuscript Dashboard')

    });
});
