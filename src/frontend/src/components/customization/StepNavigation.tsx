import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export default function StepNavigation({
  currentStep,
  onNext,
  onBack,
  canProceed,
}: StepNavigationProps) {
  return (
    <>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button
        onClick={onNext}
        disabled={!canProceed}
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
}
