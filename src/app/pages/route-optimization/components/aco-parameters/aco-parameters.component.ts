import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouteOptimizationService } from '../../../../services/route-optimization.service';
import { ACOParameters } from '../../interfaces/ACOParameters';
import { ACOResponse } from '../../interfaces/ACOResponse';

@Component({
  selector: 'aco-parameters',
  imports: [ReactiveFormsModule],
  templateUrl: './aco-parameters.component.html',
})
export class AcoParametersComponent {
  routeOptimizacionService = inject(RouteOptimizationService);

  routes = output<ACOResponse>();

  acoParametersForm = new FormGroup({
    num_ants: new FormControl(50, { nonNullable: true }),
    iterations: new FormControl(100, { nonNullable: true }),
    evaporation_rate: new FormControl(0.1, { nonNullable: true }),
    alpha: new FormControl(1, { nonNullable: true }),
    beta: new FormControl(2, { nonNullable: true }),
    vehicles: new FormControl(4, { nonNullable: true }),
    max_distance: new FormControl(25, { nonNullable: true }),
    max_capacity: new FormControl(5, { nonNullable: true }),
  });

  onSubmit = () => {
    const raw = this.acoParametersForm.value;

    const payload = {
      num_ants: raw.num_ants,
      iterations: raw.iterations,
      evaporation_rate: raw.evaporation_rate,
      alpha: raw.alpha,
      beta: raw.beta,
      vehicles: Array.from({ length: raw.vehicles ?? 0 }, () => [
        raw.max_capacity,
        raw.max_distance,
      ]),
    };

    this.routeOptimizacionService.getRoutes(payload).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res);
        this.routes.emit(res);
      },
      error: (err) => console.error('Error al generar rutas:', err),
    });
  };
}
