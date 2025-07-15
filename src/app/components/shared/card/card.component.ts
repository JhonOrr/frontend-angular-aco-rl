import { Component, input } from '@angular/core';

@Component({
  selector: 'metric-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  title = input.required();
  value = input.required();
  unit = input.required();
}
