import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss']
})
export class WorkOrderPanelComponent implements OnChanges {

  @Input() workCenters: any[] = [];
  @Input() selectedWorkCenterId = '';
  @Input() editOrder: any = null;
  @Input() defaultStartDate: Date = new Date();

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  statuses = ['open', 'in-progress', 'complete', 'blocked'];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✅ Form initialized HERE (after fb exists)
    this.form = this.fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      workCenterId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnChanges() {

    if (this.editOrder) {
      this.form.patchValue(this.editOrder.data);
    } else {
      const today = this.formatDate(this.defaultStartDate);

      this.form.patchValue({
        workCenterId: this.selectedWorkCenterId,
        startDate: today,
        endDate: today
      });
    }
  }

  onSubmit() {

    if (this.form.invalid) return;

    const value = this.form.value;

    const newOrder = {
      docId: this.editOrder?.docId || uuid(),
      docType: 'workOrder',
      data: value
    };

    this.save.emit(newOrder);
  }

  onCancel() {
    this.close.emit();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}