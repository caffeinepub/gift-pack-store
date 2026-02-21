import { useState, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import PaymentFilters, { type PaymentFilterState } from './PaymentFilters';
import PaymentList from './PaymentList';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';

export default function PaymentManagement() {
  const { data: payments, isLoading, isError, error } = usePaymentManagement();
  const [filters, setFilters] = useState<PaymentFilterState>({
    searchTerm: '',
    selectedStatus: 'all',
    dateRange: { from: undefined, to: undefined },
  });

  const filteredPayments = useMemo(() => {
    if (!payments) return [];

    return payments.filter((payment) => {
      // Search filter (transaction ID)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesPaymentId = payment.paymentId.toLowerCase().includes(searchLower);
        if (!matchesPaymentId) {
          return false;
        }
      }

      // Status filter
      if (
        filters.selectedStatus !== 'all' &&
        payment.status.toLowerCase() !== filters.selectedStatus.toLowerCase()
      ) {
        return false;
      }

      // Date range filter - Note: payments don't have timestamp in backend
      // We'll skip date filtering for now since payments don't have a timestamp field
      // If needed in the future, the backend would need to add a timestamp field

      return true;
    });
  }, [payments, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load payments. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentFilters onFilterChange={setFilters} />
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">
          {filteredPayments.length > 0
            ? `${filteredPayments.length} Payment${filteredPayments.length > 1 ? 's' : ''}`
            : 'Payments'}
        </h3>
        <PaymentList payments={filteredPayments} isLoading={isLoading} />
      </div>
    </div>
  );
}
