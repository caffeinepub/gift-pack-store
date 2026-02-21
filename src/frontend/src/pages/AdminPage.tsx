import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import CategoryManagement from '@/components/admin/CategoryManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import CouponManagement from '@/components/admin/CouponManagement';
import GiftPackManagement from '@/components/admin/GiftPackManagement';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminPage() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Admin Dashboard
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-8">
          {/* Product Management for Custom Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Product Management</CardTitle>
              <CardDescription>
                Add, edit, and delete products for custom packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductManagement />
            </CardContent>
          </Card>

          <Separator />

          {/* Category Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Category Management</CardTitle>
              <CardDescription>
                Create and manage gift pack categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>

          <Separator />

          {/* Coupon Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Coupon Management</CardTitle>
              <CardDescription>
                Create and manage discount coupons for customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CouponManagement />
            </CardContent>
          </Card>

          <Separator />

          {/* Gift Pack Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Gift Pack Management</CardTitle>
              <CardDescription>
                Add, edit, and delete pre-made gift packs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GiftPackManagement />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
