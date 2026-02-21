import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
