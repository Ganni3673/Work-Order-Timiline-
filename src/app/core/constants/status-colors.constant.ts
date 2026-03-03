import { WorkOrderStatus } from '../../shared/models/work-order.model';

export const STATUS_COLORS: Record<WorkOrderStatus, string> = {
  open: '#2563eb',
  'in-progress': '#f59e0b',
  complete: '#16a34a',
  blocked: '#dc2626'
};