import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Basket Type' },
  { number: 2, label: 'Size' },
  { number: 3, label: 'Products' },
  { number: 4, label: 'Packing' },
  { number: 5, label: 'Message' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                    isCompleted
                      ? 'border-terracotta bg-terracotta text-white'
                      : isCurrent
                        ? 'border-terracotta bg-white text-terracotta'
                        : 'border-muted bg-white text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <span
                  className={`mt-2 text-xs font-medium sm:text-sm ${
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all ${
                    isCompleted ? 'bg-terracotta' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
