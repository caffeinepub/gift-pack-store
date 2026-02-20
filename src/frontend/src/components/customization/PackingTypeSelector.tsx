import { Card, CardContent } from '@/components/ui/card';
import { PackType } from '@/backend';
import { Sparkles } from 'lucide-react';

interface PackingTypeSelectorProps {
  selectedType: PackType | null;
  onTypeChange: (type: PackType) => void;
}

const packingTypes = [
  {
    type: PackType.wrapStyle1,
    label: 'Classic Wrap',
    description: 'Traditional gift wrap with elegant finish',
    color: 'bg-red-100 border-red-300',
  },
  {
    type: PackType.wrapStyle2,
    label: 'Premium Wrap',
    description: 'Luxury paper with metallic accents',
    color: 'bg-amber-100 border-amber-300',
  },
  {
    type: PackType.ribbonColor1,
    label: 'Gold Ribbon',
    description: 'Sophisticated gold satin ribbon',
    color: 'bg-yellow-100 border-yellow-300',
  },
  {
    type: PackType.ribbonColor2,
    label: 'Silver Ribbon',
    description: 'Elegant silver satin ribbon',
    color: 'bg-slate-100 border-slate-300',
  },
];

export default function PackingTypeSelector({ selectedType, onTypeChange }: PackingTypeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {packingTypes.map(({ type, label, description, color }) => {
        const isSelected = selectedType === type;
        return (
          <Card
            key={type}
            className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-terracotta shadow-md' : 'hover:shadow-md'
            }`}
            onClick={() => onTypeChange(type)}
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className={`h-12 w-12 rounded-lg border-2 ${color} flex items-center justify-center`}>
                  <Sparkles className={`h-6 w-6 ${isSelected ? 'text-terracotta' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{label}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
