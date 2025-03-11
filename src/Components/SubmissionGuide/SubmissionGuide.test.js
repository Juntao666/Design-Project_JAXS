import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import SubmissionGuide from './SubmissionGuide';

describe('SubmissionGuide', () => {
    it('shows Submission Guide', async () => {
        render(<SubmissionGuide />);

        expect(screen.getByRole('heading'))
         .toHaveTextContent('Submission Guide')

    });
});
