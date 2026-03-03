import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h2>Work Orders</h2>

      <div>
        <button (click)="todayClick.emit()">Today</button>

        <select
          [value]="zoomLevel"
          (change)="zoomChange.emit($any($event.target).value)">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:16px;
      border-bottom:1px solid #e5e7eb;
    }
  `]
})
export class TimelineHeaderComponent {
  @Input() zoomLevel!: string;
  @Output() zoomChange = new EventEmitter<'day'|'week'|'month'>();
  @Output() todayClick = new EventEmitter<void>();
}