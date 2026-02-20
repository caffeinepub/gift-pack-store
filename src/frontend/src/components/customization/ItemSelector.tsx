import { Check, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Category } from '@/backend';
import type { GiftItem } from '@/backend';

interface ItemSelectorProps {
  selectedItems: GiftItem[];
  onItemsChange: (items: GiftItem[]) => void;
  maxItems?: number;
}

// Mock items for demonstration
const mockItems: GiftItem[] = [
  {
    id: 'item1',
    name: 'Premium Chocolate Box',
    description: 'Assorted Belgian chocolates',
    price: BigInt(599),
    category: Category.birthday,
    images: [],
  },
  {
    id: 'item2',
    name: 'Scented Candle Set',
    description: 'Lavender and vanilla scented',
    price: BigInt(399),
    category: Category.anniversary,
    images: [],
  },
  {
    id: 'item3',
    name: 'Gourmet Coffee',
    description: 'Premium Arabica blend',
    price: BigInt(499),
    category: Category.corporate,
    images: [],
  },
  {
    id: 'item4',
    name: 'Handmade Soap Set',
    description: 'Natural ingredients',
    price: BigInt(299),
    category: Category.festive,
    images: [],
  },
  {
    id: 'item5',
    name: 'Tea Collection',
    description: 'Assorted premium teas',
    price: BigInt(449),
    category: Category.corporate,
    images: [],
  },
  {
    id: 'item6',
    name: 'Dried Fruit Box',
    description: 'Healthy and delicious',
    price: BigInt(699),
    category: Category.festive,
    images: [],
  },
  {
    id: 'item7',
    name: 'Artisan Cookies',
    description: 'Handmade butter cookies',
    price: BigInt(349),
    category: Category.birthday,
    images: [],
  },
  {
    id: 'item8',
    name: 'Honey Jar Set',
    description: 'Pure organic honey',
    price: BigInt(549),
    category: Category.festive,
    images: [],
  },
];

export default function ItemSelector({ selectedItems, onItemsChange, maxItems = 12 }: ItemSelectorProps) {
  const handleToggleItem = (item: GiftItem) => {
    const isSelected = selectedItems.some((i) => i.id === item.id);
    if (isSelected) {
      onItemsChange(selectedItems.filter((i) => i.id !== item.id));
    } else {
      if (selectedItems.length >= maxItems) {
        return; // Don't add if limit reached
      }
      onItemsChange([...selectedItems, item]);
    }
  };

  const isLimitReached = selectedItems.length >= maxItems;

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Select up to {maxItems} items for your chosen size. Currently selected: {selectedItems.length}/{maxItems}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockItems.map((item) => {
          const isSelected = selectedItems.some((i) => i.id === item.id);
          const isDisabled = !isSelected && isLimitReached;
          
          return (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : isSelected
                    ? 'ring-2 ring-terracotta'
                    : 'hover:shadow-md'
              }`}
              onClick={() => !isDisabled && handleToggleItem(item)}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded border-2 ${
                      isSelected ? 'border-terracotta bg-terracotta' : 'border-muted'
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
                <p className="font-semibold text-terracotta">
                  ₹{Number(item.price).toLocaleString('en-IN')}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
