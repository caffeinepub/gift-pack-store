import { Card, CardContent } from '@/components/ui/card';
import { BasketType } from '@/backend';
import { Package, Box, Gift } from 'lucide-react';

interface BasketTypeSelectorProps {
  selectedType: BasketType | null;
  onTypeChange: (type: BasketType) => void;
}

const basketTypes = [
  {
    type: BasketType.wickerBasket,
    label: 'Wicker Basket',
    description: 'Classic handwoven basket with rustic charm',
    icon: Package,
  },
  {
    type: BasketType.woodenCrate,
    label: 'Wooden Crate',
    description: 'Sturdy wooden crate with vintage appeal',
    icon: Box,
  },
  {
    type: BasketType.giftBox,
    label: 'Gift Box',
    description: 'Elegant premium gift box with lid',
    icon: Gift,
  },
];

export default function BasketTypeSelector({ selectedType, onTypeChange }: BasketTypeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {basketTypes.map(({ type, label, description, icon: Icon }) => {
        const isSelected = selectedType === type;
        return (
          <Card
            key={type}
            className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-terracotta shadow-md' : 'hover:shadow-md'
            }`}
            onClick={() => onTypeChange(type)}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div
                  className={`rounded-full p-4 ${
                    isSelected ? 'bg-terracotta text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold">{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
