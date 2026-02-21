import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CategoryManagement from '@/components/admin/CategoryManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import CouponManagement from '@/components/admin/CouponManagement';
import GiftPackManagement from '@/components/admin/GiftPackManagement';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Admin Dashboard
        </h1>

        <div className="space-y-8">
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

          {/* Product Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Product Management</CardTitle>
              <CardDescription>
                Add new gift packs to your catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductManagement />
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
                Create and manage gift pack products
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
