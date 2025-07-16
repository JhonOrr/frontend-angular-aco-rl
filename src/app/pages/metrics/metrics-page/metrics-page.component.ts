import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  // Señales para la lógica de métricas
  velocidadInput = signal(40); // valor por defecto, editable por el usuario
  vehiculoSeleccionado = signal<number | null>(null);
  vehiculos = signal<{ vehicle_id: number; total_distance: number }[]>([]);
  distanciaVehiculo = computed(() => {
    const v = this.vehiculoSeleccionado();
    const vehiculos = this.vehiculos();
    if (v === null) return 0;
    const vehiculo = vehiculos.find((veh) => veh.vehicle_id === v);
    return vehiculo ? vehiculo.total_distance : 0;
  });
  tiempoVehiculo = computed(() => {
    const velocidad = this.velocidadInput();
    const distancia = this.distanciaVehiculo();
    return velocidad > 0 ? distancia / velocidad : 0;
  });

  // Para compatibilidad con tarjetas existentes
  distancia = this.distanciaVehiculo;
  tiempo = this.tiempoVehiculo;
  velocidadPromedio = this.velocidadInput;

  // Distancia total de todos los vehículos
  distanciaTotal = computed(() => {
    return this.vehiculos().reduce(
      (acc, v) => acc + (v.total_distance ?? 0),
      0
    );
  });

  private acoResponse: any = null;

  constructor() {}
  ngOnInit(): void {
    this.fetchACOData();
  }

  fetchACOData(): void {
    this.routeOptimizationService.getACOResult().subscribe({
      next: (response) => {
        this.acoResponse = response;
        const rutas = response?.routes?.routes ?? [];
        // Mapear vehículos disponibles
        const vehiculos = rutas.map((r: any) => ({
          vehicle_id: r.vehicle_id,
          total_distance: r.total_distance ?? 0,
        }));
        this.vehiculos.set(vehiculos);
        // Seleccionar el primer vehículo por defecto
        if (vehiculos.length > 0) {
          this.vehiculoSeleccionado.set(vehiculos[0].vehicle_id);
        }
      },
      error: (error) => {
        console.error('Error al obtener datos de ACO:', error);
      },
    });
  }

  onVelocidadChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (!isNaN(value) && value > 0) {
      this.velocidadInput.set(value);
    }
  }

  onVehiculoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = parseInt(select.value, 10);
    if (!isNaN(value)) {
      this.vehiculoSeleccionado.set(value);
    }
  }
}
