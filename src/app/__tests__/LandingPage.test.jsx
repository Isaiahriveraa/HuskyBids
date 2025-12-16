import { render, screen } from '@testing-library/react';
import Home from '../page';
import '@testing-library/jest-dom';

// Mock useRouter
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

// Mock useUser from Clerk
const mockUseUser = jest.fn();
jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

// Mock Link since it's used in the component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Landing Page (Home)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign-up and login buttons for unauthenticated users and does NOT redirect', () => {
    // Simulate unauthenticated user
    mockUseUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    render(<Home />);

    // Check for landing page content (text may appear multiple times)
    expect(screen.getAllByText('HUSKYBIDS').length).toBeGreaterThan(0);
    // Check for Get Started (sign up) and Log In links
    const signUpLinks = screen.getAllByRole('link', { name: 'Get Started' });
    expect(signUpLinks.length).toBeGreaterThan(0);
    const loginLinks = screen.getAllByRole('link', { name: 'Log In' });
    expect(loginLinks.length).toBeGreaterThan(0);

    // Crucial check: Ensure NO redirect happened
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects authenticated users to dashboard', () => {
    // Simulate authenticated user
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    render(<Home />);

    // Crucial check: Authenticated users should be auto-redirected
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('does not redirect while loading auth state', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    render(<Home />);
    
    // Should still show the title/basic layout even while loading,
    // or at least not redirect.
    expect(screen.getAllByText('HUSKYBIDS').length).toBeGreaterThan(0);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
