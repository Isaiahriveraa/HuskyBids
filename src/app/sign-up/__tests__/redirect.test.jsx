
import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpPage from '../[[...sign-up]]/page';

// Mock Clerk components
jest.mock('@clerk/nextjs', () => ({
  SignUp: (props) => {
    return <div data-testid="clerk-signup" data-props={JSON.stringify(props)}>SignUp Component</div>;
  },
}));

// Mock useSearchParams
const mockGet = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe('SignUp Page Redirect Logic', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  it('should respect the redirect query parameter for afterSignUpUrl', () => {
    // Simulate ?redirect=/betting-history
    mockGet.mockReturnValue('/betting-history');

    render(<SignUpPage />);

    const signUpComponent = screen.getByTestId('clerk-signup');
    const props = JSON.parse(signUpComponent.getAttribute('data-props'));

    // This is expected to FAIL currently because it's hardcoded to /dashboard
    expect(props.afterSignUpUrl).toBe('/betting-history');
  });

  it('should default to /dashboard if no redirect param', () => {
    mockGet.mockReturnValue(null);

    render(<SignUpPage />);

    const signUpComponent = screen.getByTestId('clerk-signup');
    const props = JSON.parse(signUpComponent.getAttribute('data-props'));

    expect(props.afterSignUpUrl).toBe('/dashboard');
  });
});
