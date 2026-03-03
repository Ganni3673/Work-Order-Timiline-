import { Component } from '@angular/core';
import { TimelineComponent } from './features/timeline/timeline.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimelineComponent],
  template: `<app-timeline></app-timeline>`
})
export class AppComponent {}