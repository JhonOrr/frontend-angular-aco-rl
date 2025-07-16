import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'metric-card',
  imports: [DecimalPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  title = input.required();
  value = input.required();
  unit = input.required();

  get numericValue(): number {
    const v = this.value();
    if (v == null) return 0;
    if (typeof v === 'number' && !isNaN(v)) return v;
    const parsed = parseFloat(v as string);
    return isNaN(parsed) ? 0 : parsed;
  }
}
