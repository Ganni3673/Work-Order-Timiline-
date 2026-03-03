export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    status: WorkOrderStatus;
    workCenterId: string;
    startDate: string;
    endDate: string;
  };
}