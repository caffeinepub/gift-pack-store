import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CatalogFilters } from '@/backend';
import { CategoryType } from '@/backend';

interface FilterSidebarProps {
  filters: CatalogFilters;
  onFiltersChange: (filters: CatalogFilters) => void;
}

const categories: { value: CategoryType; label: string }[] = [
  { value: CategoryType.birthday, label: 'Birthday' },
  { value: CategoryType.anniversary, label: 'Anniversary' },
  { value: CategoryType.corporate, label: 'Corporate' },
  { value: CategoryType.festive, label: 'Festive' },
  { value: CategoryType.custom, label: 'Custom' },
];

function FilterContent({ filters, onFiltersChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const handleCategoryChange = (category: CategoryType) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      priceRange: {
        min: BigInt(values[0]),
        max: BigInt(values[1]),
      },
    });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 10000]);
    onFiltersChange({});
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
        <Separator />
      </div>

      {/* Category Filter */}
      <div>
        <Label className="mb-3 block font-semibold">Category</Label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center space-x-2">
              <Checkbox
                id={cat.value}
                checked={filters.category === cat.value}
                onCheckedChange={() => handleCategoryChange(cat.value)}
              />
              <label
                htmlFor={cat.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cat.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <Label className="mb-3 block font-semibold">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={10000}
          step={100}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-4"
        />
      </div>
    </div>
  );
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <Card className="hidden lg:block">
        <CardContent className="p-6">
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </CardContent>
      </Card>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
