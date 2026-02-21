import { useState, useMemo } from 'react';
import OrderFilters, { type OrderFilterState } from './OrderFilters';
import OrderList from './OrderList';
import { useAllOrders } from '@/hooks/useOrderManagement';
import type { Order } from '@/backend';

export default function OrderManagement() {
  const { data: orders, isLoading } = useAllOrders();
  const [filters, setFilters] = useState<OrderFilterState>({
    searchTerm: '',
    selectedStatus: 'all',
    dateRange: { from: undefined, to: undefined },
  });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      // Search filter (order ID or customer name)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesOrderId = order.id.toLowerCase().includes(searchLower);
        const matchesCustomerName = order.deliveryAddress.name
          .toLowerCase()
          .includes(searchLower);
        if (!matchesOrderId && !matchesCustomerName) {
          return false;
        }
      }

      // Status filter
      if (filters.selectedStatus !== 'all' && order.status !== filters.selectedStatus) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const orderDate = new Date(Number(order.createdAt) / 1000000);
        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (orderDate < fromDate) {
            return false;
          }
        }
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (orderDate > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [orders, filters]);

  return (
    <div className="space-y-6">
      <OrderFilters onFilterChange={setFilters} />
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">
          {filteredOrders.length > 0
            ? `${filteredOrders.length} Order${filteredOrders.length > 1 ? 's' : ''}`
            : 'Orders'}
        </h3>
        <OrderList orders={filteredOrders} isLoading={isLoading} />
      </div>
    </div>
  );
}
