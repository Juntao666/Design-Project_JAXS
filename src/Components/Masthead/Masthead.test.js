import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import Masthead from './Masthead';

describe('Masthead', () => {
    it('shows Masthead', async () => {
        render(<Masthead />);

        expect(screen.getByRole('heading'))
         .toHaveTextContent('Journal Masthead')

    });
});
