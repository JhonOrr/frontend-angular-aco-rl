import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CardComponent } from '../../../components/shared/card/card.component';
import { RouteOptimizationService } from '../../../services/route-optimization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-page',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './metrics-page.component.html',
})
export class MetricsPageComponent implements OnInit {
  private routeOptimizationService = inject(RouteOptimizationService);

  distancia = signal(0);
  tiempo = signal(6);

  velocidadPromedio = computed(() =>
    this.tiempo() > 0 ? this.distancia() / this.tiempo() : 0
  );

  constructor() {}
  ngOnInit(): void {
    this.fetchACOData();
  }

  fetchACOData(): void {
    this.routeOptimizationService.getACOResult().subscribe({
      next: (response) => {
        const bestDistance = response?.routes?.best_distance ?? 0;
        this.distancia.set(bestDistance);
      },
      error: (error) => {
        console.error('Error al obtener datos de ACO:', error);
      },
    });
  }
}
