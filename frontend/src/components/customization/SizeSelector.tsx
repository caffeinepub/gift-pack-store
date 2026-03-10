import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Size } from '@/backend';

interface SizeSelectorProps {
  selectedSize: Size | null;
  onSizeChange: (size: Size) => void;
}

const sizes = [
  {
    size: Size.small,
    label: 'Small',
    capacity: '3-5 items',
    description: 'Perfect for a thoughtful gesture',
    price: '+₹0',
  },
  {
    size: Size.medium,
    label: 'Medium',
    capacity: '6-8 items',
    description: 'Ideal for most occasions',
    price: '+₹200',
  },
  {
    size: Size.large,
    label: 'Large',
    capacity: '9-12 items',
    description: 'Grand gesture for special moments',
    price: '+₹400',
  },
];

export default function SizeSelector({ selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sizes.map(({ size, label, capacity, description, price }) => {
        const isSelected = selectedSize === size;
        return (
          <Card
            key={size}
            className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-terracotta shadow-md' : 'hover:shadow-md'
            }`}
            onClick={() => onSizeChange(size)}
          >
            <CardContent className="p-6">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-serif text-xl font-semibold">{label}</h3>
                <Badge variant={isSelected ? 'default' : 'secondary'} className={isSelected ? 'bg-terracotta' : ''}>
                  {capacity}
                </Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{description}</p>
              <p className="font-semibold text-terracotta">{price}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
