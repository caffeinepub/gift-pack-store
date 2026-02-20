import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CustomPackPage from './pages/CustomPackPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { Toaster } from '@/components/ui/sonner';

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  customPackRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
