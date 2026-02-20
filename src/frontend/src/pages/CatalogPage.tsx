import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import { useFilteredGiftPacks } from '@/hooks/useGiftPacks';
import type { CatalogFilters } from '@/backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: giftPacks, isLoading } = useFilteredGiftPacks({
    ...filters,
    searchTerm: searchTerm || undefined,
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Browse Gift Packs</h1>
          <p className="mt-2 text-muted-foreground">
            Discover the perfect gift for every occasion
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search gift packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter Sidebar */}
          <aside className="lg:w-64">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid giftPacks={giftPacks || []} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
