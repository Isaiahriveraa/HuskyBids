/**
 * Auth Pages Tests
 * Verifies that sign-up and login pages are configured correctly
 *
 * CRITICAL: These tests ensure the auth navigation fix is in place.
 * The routing="hash" prop was removed because it caused auth state
 * to be stored in URL hash fragments, which server-side middleware
 * cannot read, causing users to be redirected back to sign-up.
 */
import React from 'react';
import { render } from '@testing-library/react';

// Mock Clerk components
const mockSignUp = jest.fn();
const mockSignIn = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  SignUp: (props) => {
    mockSignUp(props);
    return <div data-testid="clerk-signup">SignUp Component</div>;
  },
  SignIn: (props) => {
    mockSignIn(props);
    return <div data-testid="clerk-signin">SignIn Component</div>;
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));

// Import components after mocks
import SignUpPage from '../sign-up/[[...sign-up]]/page';
import LoginPage from '../login/[[...sign-in]]/page';

describe('Auth Pages Configuration', () => {
  beforeEach(() => {
    mockSignUp.mockClear();
    mockSignIn.mockClear();
  });

  describe('SignUp Page', () => {
    it('should NOT use routing="hash" (auth fix)', () => {
      render(<SignUpPage />);

      // Verify SignUp was called
      expect(mockSignUp).toHaveBeenCalled();

      const props = mockSignUp.mock.calls[0][0];

      // CRITICAL: routing should NOT be "hash"
      // Hash routing causes auth state to be invisible to middleware
      expect(props.routing).not.toBe('hash');
    });

    it('should have correct path configuration', () => {
      render(<SignUpPage />);

      const props = mockSignUp.mock.calls[0][0];

      expect(props.path).toBe('/sign-up');
      expect(props.afterSignUpUrl).toBe('/dashboard');
      expect(props.signInUrl).toBe('/login');
    });

    it('should use monospace font styling', () => {
      render(<SignUpPage />);

      const props = mockSignUp.mock.calls[0][0];

      expect(props.appearance.variables.fontFamily).toContain('monospace');
    });
  });

  describe('Login Page', () => {
    it('should NOT use routing="hash" (auth fix)', () => {
      render(<LoginPage />);

      // Verify SignIn was called
      expect(mockSignIn).toHaveBeenCalled();

      const props = mockSignIn.mock.calls[0][0];

      // CRITICAL: routing should NOT be "hash"
      // Hash routing causes auth state to be invisible to middleware
      expect(props.routing).not.toBe('hash');
    });

    it('should have correct path configuration', () => {
      render(<LoginPage />);

      const props = mockSignIn.mock.calls[0][0];

      expect(props.path).toBe('/login');
      expect(props.signUpUrl).toBe('/sign-up');
    });

    it('should redirect to dashboard by default', () => {
      render(<LoginPage />);

      const props = mockSignIn.mock.calls[0][0];

      // Default redirect when no ?redirect param
      expect(props.afterSignInUrl).toBe('/dashboard');
    });

    it('should use monospace font styling', () => {
      render(<LoginPage />);

      const props = mockSignIn.mock.calls[0][0];

      expect(props.appearance.variables.fontFamily).toContain('monospace');
    });
  });
});
