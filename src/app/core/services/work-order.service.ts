import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { WorkCenterDocument } from '../../shared/models/work-center.model';
import { WorkOrderDocument } from '../../shared/models/work-order.model';
import { hasOverlap } from '../../shared/utils/overlap.utils';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  private workCenters: WorkCenterDocument[] = [
    { docId: 'wc1', docType: 'workCenter', data: { name: 'Extrusion Line A' }},
    { docId: 'wc2', docType: 'workCenter', data: { name: 'CNC Machine 1' }},
    { docId: 'wc3', docType: 'workCenter', data: { name: 'Assembly Station' }},
    { docId: 'wc4', docType: 'workCenter', data: { name: 'Quality Control' }},
    { docId: 'wc5', docType: 'workCenter', data: { name: 'Packaging Line' }},
  ];

  private workOrders: WorkOrderDocument[] = [
    {
      docId: uuid(),
      docType: 'workOrder',
      data: {
        name: 'Order A',
        workCenterId: 'wc1',
        status: 'complete',
        startDate: '2026-03-01',
        endDate: '2026-03-05'
      }
    },
    {
      docId: uuid(),
      docType: 'workOrder',
      data: {
        name: 'Order B',
        workCenterId: 'wc1',
        status: 'in-progress',
        startDate: '2026-03-07',
        endDate: '2026-03-12'
      }
    },
    {
      docId: uuid(),
      docType: 'workOrder',
      data: {
        name: 'Order C',
        workCenterId: 'wc3',
        status: 'blocked',
        startDate: '2026-03-02',
        endDate: '2026-03-08'
      }
    },
    {
      docId: uuid(),
      docType: 'workOrder',
      data: {
        name: 'Order D',
        workCenterId: 'wc4',
        status: 'open',
        startDate: '2026-03-10',
        endDate: '2026-03-18'
      }
    }
  ];

  getWorkCenters() {
    return this.workCenters;
  }

  getWorkOrders() {
    return this.workOrders;
  }

  addWorkOrder(order: WorkOrderDocument): boolean {
    const overlapping = this.workOrders.some(existing =>
      existing.data.workCenterId === order.data.workCenterId &&
      hasOverlap(
        new Date(order.data.startDate),
        new Date(order.data.endDate),
        new Date(existing.data.startDate),
        new Date(existing.data.endDate)
      )
    );

    if (overlapping) {
      return false;
    }

    this.workOrders.push(order);
    return true;
  }

  deleteWorkOrder(id: string) {
    this.workOrders = this.workOrders.filter(o => o.docId !== id);
  }


  updateWorkOrder(updatedOrder: WorkOrderDocument): boolean {
  const index = this.workOrders.findIndex(
    order => order.docId === updatedOrder.docId
  );

  if (index === -1) {
    return false;
  }

  // Check overlap excluding the current order being edited
  const overlapping = this.workOrders.some(existing =>
    existing.docId !== updatedOrder.docId &&
    existing.data.workCenterId === updatedOrder.data.workCenterId &&
    hasOverlap(
      new Date(updatedOrder.data.startDate),
      new Date(updatedOrder.data.endDate),
      new Date(existing.data.startDate),
      new Date(existing.data.endDate)
    )
  );

  if (overlapping) {
    return false;
  }

  this.workOrders[index] = updatedOrder;
  return true;
}
}