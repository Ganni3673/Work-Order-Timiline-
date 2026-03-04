import { WorkOrderStatus } from '../../shared/models/work-order.model';

export const STATUS_COLORS: Record<WorkOrderStatus, string> = {
  open: '#3b82f6',         // Blue
  'in-progress': '#8b5cf6', // Purple
  complete: '#22c55e',     // Green
  blocked: '#f59e0b'       // Yellow
};