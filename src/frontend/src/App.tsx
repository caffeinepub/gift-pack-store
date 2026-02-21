import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { useEffect, useRef } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CustomPackPage from './pages/CustomPackPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { Toaster } from '@/components/ui/sonner';
import { useInitializeData } from './hooks/useQueries';
import { useActor } from './hooks/useActor';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCart } from './hooks/useCart';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
});

const customPackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/custom',
  component: CustomPackPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  customPackRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  profileRoute,
  contactRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { actor, isFetching } = useActor();
  const { mutate: initialize } = useInitializeData();
  const { identity } = useInternetIdentity();
  const { syncCartFromBackend, clearCartCompletely } = useCart();
  
  // Track previous authentication state
  const prevIdentityRef = useRef<typeof identity>(undefined);

  useEffect(() => {
    if (actor && !isFetching) {
      initialize();
    }
  }, [actor, isFetching, initialize]);

  // Handle login/logout events
  useEffect(() => {
    const prevIdentity = prevIdentityRef.current;
    const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
    const wasAuthenticated = !!prevIdentity && !prevIdentity.getPrincipal().isAnonymous();

    // User just logged in
    if (isAuthenticated && !wasAuthenticated && actor && !isFetching) {
      syncCartFromBackend();
    }

    // User just logged out
    if (!isAuthenticated && wasAuthenticated) {
      clearCartCompletely();
    }

    // Update the ref for next comparison
    prevIdentityRef.current = identity;
  }, [identity, actor, isFetching, syncCartFromBackend, clearCartCompletely]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
