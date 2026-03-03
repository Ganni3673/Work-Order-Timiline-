import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';
import { WorkOrderDocument, WorkOrderStatus } from '../../shared/models/work-order.model';
import { STATUS_COLORS } from '../../core/constants/status-colors.constant';


@Component({
  selector: 'app-timeline',
  standalone: true,
imports: [CommonModule, WorkOrderPanelComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  zoomLevel: 'day' | 'week' | 'month' = 'day';
  columnWidth = 120;

  columns: Date[] = [];
  visibleStart = new Date();
  visibleEnd = new Date();
  today = new Date();

  isPanelOpen = false;
  selectedDate = new Date();
  selectedWorkCenterId = '';
  editingOrder: WorkOrderDocument | null = null;

  activeMenu: string | null = null;

  workCenters = [
    { docId: '1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
    { docId: '2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
    { docId: '3', docType: 'workCenter', data: { name: 'Assembly Station' } },
    { docId: '4', docType: 'workCenter', data: { name: 'Quality Control' } },
    { docId: '5', docType: 'workCenter', data: { name: 'Packaging Line' } }
  ];

  workOrders: WorkOrderDocument[] = [];

  ngOnInit() {
    this.initTimeline();
  }

  initTimeline() {
    this.visibleStart = new Date();
    this.visibleStart.setDate(this.visibleStart.getDate() - 7);

    this.visibleEnd = new Date();
    this.visibleEnd.setDate(this.visibleEnd.getDate() + 14);

    this.generateColumns();
  }

  generateColumns() {
    this.columns = [];
    const current = new Date(this.visibleStart);

    while (current <= this.visibleEnd) {
      this.columns.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  getLeftPosition(date: string | Date): number {
    const d = new Date(date);
    const diff = (d.getTime() - this.visibleStart.getTime()) / (1000 * 60 * 60 * 24);
    return diff * this.columnWidth;
  }

  getBarWidth(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1;
    return diff * this.columnWidth;
  }

  getOrdersForWorkCenter(id: string) {
    return this.workOrders.filter(o => o.data.workCenterId === id);
  }

  getStatusColor(status: WorkOrderStatus) {
    return STATUS_COLORS[status];
  }

  hasOverlap(newOrder: WorkOrderDocument): boolean {
    const orders = this.getOrdersForWorkCenter(newOrder.data.workCenterId);

    return orders.some(existing => {
      if (existing.docId === newOrder.docId) return false;

      const startA = new Date(existing.data.startDate).getTime();
      const endA = new Date(existing.data.endDate).getTime();
      const startB = new Date(newOrder.data.startDate).getTime();
      const endB = new Date(newOrder.data.endDate).getTime();

      return startB <= endA && endB >= startA;
    });
  }

  openCreate(workCenterId: string, date?: Date) {
    this.selectedWorkCenterId = workCenterId;
    this.selectedDate = date || new Date();
    this.editingOrder = null;
    this.isPanelOpen = true;
  }

  openEditPanel(order: WorkOrderDocument) {
    this.editingOrder = order;
    this.selectedWorkCenterId = order.data.workCenterId;
    this.isPanelOpen = true;
  }

  deleteOrder(id: string) {
    this.workOrders = this.workOrders.filter(o => o.docId !== id);
    this.activeMenu = null;
  }

  toggleMenu(id: string) {
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  handleSave(order: WorkOrderDocument) {

    if (this.hasOverlap(order)) {
      alert('Work order overlaps with existing one.');
      return;
    }

    const index = this.workOrders.findIndex(o => o.docId === order.docId);

    if (index > -1) {
      this.workOrders[index] = order;
    } else {
      this.workOrders.push(order);
    }

    this.isPanelOpen = false;
  }

  handleClose() {
    this.isPanelOpen = false;
  }

  onZoomChange(level: 'day' | 'week' | 'month') {
    this.zoomLevel = level;

    if (level === 'day') this.columnWidth = 120;
    if (level === 'week') this.columnWidth = 200;
    if (level === 'month') this.columnWidth = 300;
  }

  onGridClick(workCenterId: string, date: Date) {
    this.openCreate(workCenterId, date);
  }

  goToToday() {
    this.initTimeline();
  }
}