import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import ItemSelector from '@/components/customization/ItemSelector';
import PackPreview from '@/components/customization/PackPreview';
import BasketTypeSelector from '@/components/customization/BasketTypeSelector';
import SizeSelector from '@/components/customization/SizeSelector';
import PackingTypeSelector from '@/components/customization/PackingTypeSelector';
import MessageCardForm from '@/components/customization/MessageCardForm';
import StepIndicator from '@/components/customization/StepIndicator';
import StepNavigation from '@/components/customization/StepNavigation';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import type { GiftItem, BasketType, Size, PackType } from '@/backend';

export default function CustomPackPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Basket Type
  const [basketType, setBasketType] = useState<BasketType | null>(null);
  
  // Step 2: Size
  const [size, setSize] = useState<Size | null>(null);
  
  // Step 3: Products
  const [selectedItems, setSelectedItems] = useState<GiftItem[]>([]);
  
  // Step 4: Packing Type
  const [packingType, setPackingType] = useState<PackType | null>(null);
  
  // Step 5: Message Card
  const [messageCard, setMessageCard] = useState('');

  // Get max items based on size
  const getMaxItems = (): number => {
    if (!size) return 12;
    switch (size) {
      case 'small': return 5;
      case 'medium': return 8;
      case 'large': return 12;
      default: return 12;
    }
  };

  // Validation for each step
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return basketType !== null;
      case 2: return size !== null;
      case 3: return selectedItems.length > 0;
      case 4: return packingType !== null;
      case 5: return true; // Message is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddToCart = () => {
    if (!basketType || !size || !packingType || selectedItems.length === 0) {
      toast.error('Please complete all required steps');
      return;
    }

    // Create a custom pack ID
    const customPackId = `custom-${Date.now()}`;

    addItem({
      packId: customPackId,
      quantity: BigInt(1),
      customMessage: messageCard || undefined,
      wrappingOption: packingType || undefined,
    });

    toast.success('Custom pack added to cart!');
    navigate({ to: '/cart' });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Create Your Custom Gift Pack
          </h1>
          <p className="mt-2 text-muted-foreground">
            Follow the steps to build your perfect gift
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Basket Type */}
            {currentStep === 1 && (
              <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Choose Basket Type</h2>
                <BasketTypeSelector
                  selectedType={basketType}
                  onTypeChange={setBasketType}
                />
              </section>
            )}

            {/* Step 2: Size */}
            {currentStep === 2 && (
              <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Select Size</h2>
                <SizeSelector
                  selectedSize={size}
                  onSizeChange={setSize}
                />
              </section>
            )}

            {/* Step 3: Products */}
            {currentStep === 3 && (
              <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Select Products</h2>
                <ItemSelector
                  selectedItems={selectedItems}
                  onItemsChange={setSelectedItems}
                  maxItems={getMaxItems()}
                />
              </section>
            )}

            {/* Step 4: Packing Type */}
            {currentStep === 4 && (
              <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Choose Packing Style</h2>
                <PackingTypeSelector
                  selectedType={packingType}
                  onTypeChange={setPackingType}
                />
              </section>
            )}

            {/* Step 5: Message Card */}
            {currentStep === 5 && (
              <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Add a Message Card</h2>
                <MessageCardForm
                  message={messageCard}
                  onMessageChange={setMessageCard}
                />
              </section>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {currentStep < 5 ? (
                <StepNavigation
                  currentStep={currentStep}
                  onNext={handleNext}
                  onBack={handleBack}
                  canProceed={canProceed()}
                />
              ) : (
                <>
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleAddToCart} size="lg">
                    Add to Cart
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Preview Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <PackPreview
              basketType={basketType}
              size={size}
              selectedItems={selectedItems}
              packingType={packingType}
              messageCard={messageCard}
              onRemoveItem={(itemId) => {
                setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
              }}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
