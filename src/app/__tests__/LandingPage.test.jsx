import { render, screen, waitFor } from '@testing-library/react';
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
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Landing Page (Home)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign-up and login buttons for unauthenticated users and does NOT redirect', async () => {
    // Simulate unauthenticated user
    mockUseUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    render(<Home />);

    // Check for landing page content
    expect(screen.getByText('HuskyBids')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();

    // Crucial check: Ensure NO redirect happened
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renders dashboard link for authenticated users', async () => {
    // Simulate authenticated user
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    render(<Home />);

    // Check for dashboard link
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    
    // Ensure "Sign Up" is NOT present
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('does not redirect while loading auth state', () => {
     mockUseUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    render(<Home />);
    
    // Should still show the title/basic layout even while loading, 
    // or at least not redirect.
    expect(screen.getByText('HuskyBids')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
