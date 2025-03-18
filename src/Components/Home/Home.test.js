import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import Home from './Home';

describe('Home', () => {
    it('shows Home', async () => {
        render(<Home />);

        expect(screen.getByRole('heading'))
         .toHaveTextContent('Journal')

    });
});
