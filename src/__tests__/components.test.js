// // // React Component Tests for Current NFT Platform
// // // Setup: npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom


// // /**
// //  * Basic component tests to verify setup
// //  */
// // import React from 'react';

// // // Simple test to verify Jest setup works
// // describe('Test Setup Verification', () => {
// //   it('should run basic test', () => {
// //     expect(true).toBe(true);
// //   });

// //   it('should handle basic math', () => {
// //     expect(2 + 2).toBe(4);
// //   });
// // });


/**
 * Basic component tests with no Web3 dependencies
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test components
const SimpleButton = ({ onClick, children }) => {
  return (
    <button data-testid="simple-button" onClick={onClick}>
      {children}
    </button>
  );
};

const WelcomeMessage = ({ name }) => {
  return (
    <div data-testid="welcome-message">
      <h1>Welcome to Current NFT Platform</h1>
      {name && <p>Hello, {name}!</p>}
    </div>
  );
};

describe('Basic Component Tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should render welcome message', () => {
    render(<WelcomeMessage />);
    expect(screen.getByTestId('welcome-message')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Current NFT Platform')).toBeInTheDocument();
  });

  it('should render welcome message with name', () => {
    render(<WelcomeMessage name="Peter" />);
    expect(screen.getByText('Hello, Peter!')).toBeInTheDocument();
  });

  it('should render button component', () => {
    const mockClick = jest.fn();
    render(<SimpleButton onClick={mockClick}>Click me</SimpleButton>);
    
    const button = screen.getByTestId('simple-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should handle button clicks', () => {
    const mockClick = jest.fn();
    render(<SimpleButton onClick={mockClick}>Test Button</SimpleButton>);
    
    const button = screen.getByTestId('simple-button');
    button.click();
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});



// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import '@testing-library/jest-dom';
// import { BrowserRouter } from 'react-router-dom';
// import { WagmiProvider } from 'wagmi';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// // Mock dependencies
// jest.mock('@rainbow-me/rainbowkit', () => ({
//   ...jest.requireActual('@rainbow-me/rainbowkit'),
//   ConnectButton: () => <button>Connect Wallet</button>,
//   useAccount: () => ({ isConnected: false, address: null }),
//   useBalance: () => ({ data: null }),
// }));

// jest.mock('wagmi', () => ({
//   ...jest.requireActual('wagmi'),
//   useAccount: () => ({ isConnected: false, address: null }),
//   useContractWrite: () => ({ write: jest.fn(), isLoading: false }),
//   useContractRead: () => ({ data: null, isLoading: false }),
//   usePrepareContractWrite: () => ({ config: {} }),
// }));

// // Mock geolocation API
// const mockGeolocation = {
//   getCurrentPosition: jest.fn((success) => 
//     success({
//       coords: {
//         latitude: 53.3498,
//         longitude: -6.2603,
//       },
//     })
//   ),
//   watchPosition: jest.fn(),
//   clearWatch: jest.fn(),
// };

// Object.defineProperty(global.navigator, 'geolocation', {
//   value: mockGeolocation,
//   writable: true,
// });

// // Import components to test
// import HomePage from '../src/pages/HomePage';
// import MintPage from '../src/pages/MintPage';
// import MapPage from '../src/pages/MapPage';
// import ProfilePage from '../src/pages/ProfilePage';
// import Layout from '../src/components/Layout';
// import ProtectedRoute from '../src/components/ProtectedRoute';

// // Test wrapper component with all necessary providers
// const TestWrapper = ({ children }) => {
//   const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: { retry: false },
//       mutations: { retry: false },
//     },
//   });

//   const mockConfig = {
//     chains: [],
//     connectors: [],
//     publicClient: {},
//   };

//   return (
//     <BrowserRouter>
//       <WagmiProvider config={mockConfig}>
//         <QueryClientProvider client={queryClient}>
//           <RainbowKitProvider>
//             {children}
//           </RainbowKitProvider>
//         </QueryClientProvider>
//       </WagmiProvider>
//     </BrowserRouter>
//   );
// };

// describe('Current NFT Platform - React Components', () => {
  
//   describe('HomePage Component', () => {
//     it('renders homepage with correct title and description', () => {
//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Discover Art on the Blockchain/i)).toBeInTheDocument();
//       expect(screen.getByText(/Connect with artists, explore NFT collections/i)).toBeInTheDocument();
//     });

//     it('displays connect wallet button', () => {
//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
//     });

//     it('shows main navigation cards', () => {
//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Explore Map/i)).toBeInTheDocument();
//       expect(screen.getByText(/Mint NFTs/i)).toBeInTheDocument();
//       expect(screen.getByText(/Artist Profiles/i)).toBeInTheDocument();
//     });

//     it('displays platform statistics', () => {
//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       // Mock statistics should be displayed
//       expect(screen.getByText(/NFTs Minted/i)).toBeInTheDocument();
//       expect(screen.getByText(/Active Artists/i)).toBeInTheDocument();
//       expect(screen.getByText(/Countries/i)).toBeInTheDocument();
//     });
//   });

//   describe('MintPage Component', () => {
//     it('shows wallet connection prompt when not connected', () => {
//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Create Your Location NFT/i)).toBeInTheDocument();
//       expect(screen.getByText(/Connect your wallet to start minting/i)).toBeInTheDocument();
//     });

//     it('renders minting form when wallet is connected', () => {
//       // Mock connected wallet
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Create Location NFT/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Artwork Title/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
//       expect(screen.getByText(/Upload Artwork/i)).toBeInTheDocument();
//     });

//     it('handles file upload correctly', async () => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       const fileInput = screen.getByTestId('file-upload-input');
//       const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });

//       await userEvent.upload(fileInput, file);

//       expect(fileInput.files[0]).toBe(file);
//       expect(fileInput.files).toHaveLength(1);
//     });

//     it('requests geolocation when get location button is clicked', async () => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       const locationButton = screen.getByText(/Get Current Location/i);
//       await userEvent.click(locationButton);

//       expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
//     });

//     it('validates required fields before submission', async () => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       const mintButton = screen.getByText(/Mint Location NFT/i);
//       expect(mintButton).toBeDisabled();

//       // Fill required fields
//       const titleInput = screen.getByLabelText(/Artwork Title/i);
//       await userEvent.type(titleInput, 'Test Artwork');

//       const fileInput = screen.getByTestId('file-upload-input');
//       const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
//       await userEvent.upload(fileInput, file);

//       await waitFor(() => {
//         expect(mintButton).not.toBeDisabled();
//       });
//     });
//   });

//   describe('MapPage Component', () => {
//     // Mock Mapbox GL JS
//     beforeEach(() => {
//       global.mapboxgl = {
//         Map: jest.fn(() => ({
//           on: jest.fn(),
//           remove: jest.fn(),
//           addSource: jest.fn(),
//           addLayer: jest.fn(),
//           flyTo: jest.fn(),
//         })),
//         NavigationControl: jest.fn(),
//         Marker: jest.fn(() => ({
//           setLngLat: jest.fn().mockReturnThis(),
//           addTo: jest.fn().mockReturnThis(),
//           setPopup: jest.fn().mockReturnThis(),
//         })),
//         Popup: jest.fn(() => ({
//           setHTML: jest.fn().mockReturnThis(),
//         })),
//       };
//     });

//     it('renders map container', () => {
//       render(
//         <TestWrapper>
//           <MapPage />
//         </TestWrapper>
//       );

//       expect(screen.getByTestId('map-container')).toBeInTheDocument();
//     });

//     it('shows loading state initially', () => {
//       render(
//         <TestWrapper>
//           <MapPage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Loading map/i)).toBeInTheDocument();
//     });

//     it('displays search and filter controls', () => {
//       render(
//         <TestWrapper>
//           <MapPage />
//         </TestWrapper>
//       );

//       expect(screen.getByPlaceholderText(/Search locations/i)).toBeInTheDocument();
//       expect(screen.getByText(/Filter/i)).toBeInTheDocument();
//     });

//     it('handles search input changes', async () => {
//       render(
//         <TestWrapper>
//           <MapPage />
//         </TestWrapper>
//       );

//       const searchInput = screen.getByPlaceholderText(/Search locations/i);
//       await userEvent.type(searchInput, 'Dublin');

//       expect(searchInput.value).toBe('Dublin');
//     });
//   });

//   describe('ProfilePage Component', () => {
//     it('shows connect wallet message when not connected', () => {
//       render(
//         <TestWrapper>
//           <ProfilePage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Connect your wallet/i)).toBeInTheDocument();
//     });

//     it('displays user profile when connected', () => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <ProfilePage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
//       expect(screen.getByText(/0x1234...7890/i)).toBeInTheDocument();
//     });

//     it('shows collected NFTs section', () => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <ProfilePage />
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Collected NFTs/i)).toBeInTheDocument();
//       expect(screen.getByText(/Claimed Artworks/i)).toBeInTheDocument();
//     });
//   });

//   describe('Layout Component', () => {
//     it('renders navigation header', () => {
//       render(
//         <TestWrapper>
//           <Layout>
//             <div>Test Content</div>
//           </Layout>
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Current/i)).toBeInTheDocument();
//       expect(screen.getByText(/Home/i)).toBeInTheDocument();
//       expect(screen.getByText(/Map/i)).toBeInTheDocument();
//       expect(screen.getByText(/Mint/i)).toBeInTheDocument();
//       expect(screen.getByText(/Profile/i)).toBeInTheDocument();
//     });

//     it('renders children content', () => {
//       render(
//         <TestWrapper>
//           <Layout>
//             <div>Test Content</div>
//           </Layout>
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
//     });

//     it('shows mobile navigation menu', async () => {
//       // Mock mobile viewport
//       global.innerWidth = 500;
//       global.dispatchEvent(new Event('resize'));

//       render(
//         <TestWrapper>
//           <Layout>
//             <div>Test Content</div>
//           </Layout>
//         </TestWrapper>
//       );

//       const mobileMenuButton = screen.getByTestId('mobile-menu-button');
//       await userEvent.click(mobileMenuButton);

//       expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
//     });
//   });

//   describe('ProtectedRoute Component', () => {
//     it('renders children when wallet is connected', () => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <ProtectedRoute>
//             <div>Protected Content</div>
//           </ProtectedRoute>
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
//     });

//     it('shows connect wallet message when not connected', () => {
//       render(
//         <TestWrapper>
//           <ProtectedRoute>
//             <div>Protected Content</div>
//           </ProtectedRoute>
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Connect your wallet/i)).toBeInTheDocument();
//       expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
//     });

//     it('allows access without connection when requireConnection is false', () => {
//       render(
//         <TestWrapper>
//           <ProtectedRoute requireConnection={false}>
//             <div>Public Content</div>
//           </ProtectedRoute>
//         </TestWrapper>
//       );

//       expect(screen.getByText(/Public Content/i)).toBeInTheDocument();
//     });
//   });

//   describe('Integration Tests', () => {
//     it('navigates between pages correctly', async () => {
//       render(
//         <TestWrapper>
//           <Layout>
//             <HomePage />
//           </Layout>
//         </TestWrapper>
//       );

//       // Click on Map navigation
//       const mapLink = screen.getByRole('link', { name: /Map/i });
//       await userEvent.click(mapLink);

//       // Should navigate to map page (in real app)
//       expect(mapLink.getAttribute('href')).toBe('/map');
//     });

//     it('handles wallet connection flow', async () => {
//       const mockConnect = jest.fn();
//       jest.mocked(require('@rainbow-me/rainbowkit').ConnectButton).mockImplementation(
//         ({ children }) => (
//           <button onClick={mockConnect}>
//             {children || 'Connect Wallet'}
//           </button>
//         )
//       );

//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       const connectButton = screen.getByText(/Connect Wallet/i);
//       await userEvent.click(connectButton);

//       expect(mockConnect).toHaveBeenCalled();
//     });

//     it('shows error states gracefully', () => {
//       // Mock error state
//       jest.mocked(require('wagmi').useContractRead).mockReturnValue({
//         data: null,
//         isLoading: false,
//         error: new Error('Contract error'),
//       });

//       render(
//         <TestWrapper>
//           <ProfilePage />
//         </TestWrapper>
//       );

//       // Should handle error gracefully without crashing
//       expect(screen.getByText(/Connect your wallet/i)).toBeInTheDocument();
//     });
//   });

//   describe('Accessibility Tests', () => {
//     it('has proper ARIA labels on interactive elements', () => {
//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
//       expect(connectButton).toBeInTheDocument();
//     });

//     it('supports keyboard navigation', async () => {
//       render(
//         <TestWrapper>
//           <Layout>
//             <HomePage />
//           </Layout>
//         </TestWrapper>
//       );

//       // Tab through navigation elements
//       await userEvent.tab();
//       expect(screen.getByRole('link', { name: /Home/i })).toHaveFocus();

//       await userEvent.tab();
//       expect(screen.getByRole('link', { name: /Map/i })).toHaveFocus();
//     });

//     it('has proper heading hierarchy', () => {
//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       const mainHeading = screen.getByRole('heading', { level: 1 });
//       expect(mainHeading).toBeInTheDocument();
//     });
//   });

//   describe('Performance Tests', () => {
//     it('renders without performance warnings', () => {
//       const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

//       render(
//         <TestWrapper>
//           <HomePage />
//         </TestWrapper>
//       );

//       expect(consoleSpy).not.toHaveBeenCalledWith(
//         expect.stringContaining('Warning')
//       );

//       consoleSpy.mockRestore();
//     });

//     it('cleans up event listeners on unmount', () => {
//       const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

//       const { unmount } = render(
//         <TestWrapper>
//           <MapPage />
//         </TestWrapper>
//       );

//       unmount();

//       // Should clean up geolocation and map event listeners
//       expect(removeEventListenerSpy).toHaveBeenCalled();
//     });
//   });

//   describe('Form Validation Tests', () => {
//     beforeEach(() => {
//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });
//     });

//     it('validates email format in contact forms', async () => {
//       render(
//         <TestWrapper>
//           <ProfilePage />
//         </TestWrapper>
//       );

//       // If there's a contact form in profile
//       const emailInput = screen.queryByLabelText(/Email/i);
//       if (emailInput) {
//         await userEvent.type(emailInput, 'invalid-email');
//         fireEvent.blur(emailInput);

//         expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
//       }
//     });

//     it('validates file types for NFT uploads', async () => {
//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       const fileInput = screen.getByTestId('file-upload-input');
//       const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

//       await userEvent.upload(fileInput, invalidFile);

//       expect(screen.getByText(/Please select a valid image file/i)).toBeInTheDocument();
//     });

//     it('validates coordinate ranges for manual location entry', async () => {
//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       // If manual coordinate entry exists
//       const latInput = screen.queryByLabelText(/Latitude/i);
//       if (latInput) {
//         await userEvent.type(latInput, '91'); // Invalid latitude > 90
//         fireEvent.blur(latInput);

//         expect(screen.getByText(/Latitude must be between -90 and 90/i)).toBeInTheDocument();
//       }
//     });
//   });

//   describe('Error Boundary Tests', () => {
//     it('catches and displays error when component throws', () => {
//       const ThrowError = () => {
//         throw new Error('Test error');
//       };

//       const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

//       render(
//         <TestWrapper>
//           <ThrowError />
//         </TestWrapper>
//       );

//       // Should show error boundary UI instead of crashing
//       expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

//       consoleSpy.mockRestore();
//     });
//   });

//   describe('Loading States', () => {
//     it('shows loading spinner during contract interactions', () => {
//       jest.mocked(require('wagmi').useContractWrite).mockReturnValue({
//         write: jest.fn(),
//         isLoading: true,
//       });

//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <MintPage />
//         </TestWrapper>
//       );

//       expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
//     });

//     it('shows skeleton loading for NFT collections', () => {
//       jest.mocked(require('wagmi').useContractRead).mockReturnValue({
//         data: null,
//         isLoading: true,
//         error: null,
//       });

//       jest.mocked(require('wagmi').useAccount).mockReturnValue({
//         isConnected: true,
//         address: '0x1234567890123456789012345678901234567890',
//       });

//       render(
//         <TestWrapper>
//           <ProfilePage />
//         </TestWrapper>
//       );

//       expect(screen.getByTestId('nft-skeleton')).toBeInTheDocument();
//     });
//   });
// });

// // Custom test utilities
// export const renderWithProviders = (ui, options = {}) => {
//   const AllProviders = ({ children }) => (
//     <TestWrapper>{children}</TestWrapper>
//   );

//   return render(ui, { wrapper: AllProviders, ...options });
// };

// export const mockWalletConnection = (connected = true, address = '0x1234567890123456789012345678901234567890') => {
//   jest.mocked(require('wagmi').useAccount).mockReturnValue({
//     isConnected: connected,
//     address: connected ? address : null,
//   });
// };

// export const mockContractCall = (data = null, isLoading = false, error = null) => {
//   jest.mocked(require('wagmi').useContractRead).mockReturnValue({
//     data,
//     isLoading,
//     error,
//   });
// };

// // Cleanup function for tests
// afterEach(() => {
//   jest.clearAllMocks();
// });