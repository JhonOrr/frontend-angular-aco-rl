import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Stop {
  type: string;
  location: [number, number];
  demand?: number;
  customer?: string;
  order_id?: number;
}

interface VehicleRoute {
  stops: Stop[];
  capacity: number;
  vehicle_id: number;
  max_distance: number;
  total_distance: number;
}

interface ApiResponse {
  routes: {
    routes: VehicleRoute[];
    best_distance: number;
  };
  metadata: any;
}

@Component({
  selector: 'app-simulation-page',
  standalone: true,
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SimulationPageComponent implements OnInit {
  apiUrl =
    'https://backen-django-aco-rl-fgagduasagdbejh8.northcentralus-01.azurewebsites.net/api/get-routes/';
  vehicleRoutes: VehicleRoute[] = [];
  maxTime: number = 0; // en minutos
  time: number = 0; // en minutos
  speedKmh: number = 30; // velocidad promedio
  loading = true;

  ngOnInit() {
    this.fetchRoutes();
  }

  async fetchRoutes() {
    this.loading = true;
    try {
      const res = await fetch(this.apiUrl);
      const data: ApiResponse = await res.json();
      this.vehicleRoutes = data.routes.routes;
      // Calcular el tiempo máximo necesario para la simulación (ruta más larga)
      const maxDist = Math.max(
        ...this.vehicleRoutes.map((r) => r.total_distance)
      );
      this.maxTime = Math.ceil((maxDist / this.speedKmh) * 60); // minutos
      this.time = 0;
    } finally {
      this.loading = false;
    }
  }

  onSpeedChange() {
    if (this.vehicleRoutes.length > 0) {
      const maxDist = Math.max(
        ...this.vehicleRoutes.map((r) => r.total_distance)
      );
      this.maxTime = Math.ceil((maxDist / this.speedKmh) * 60); // minutos
      if (this.time > this.maxTime) this.time = this.maxTime;
    }
  }

  // Calcula el estado de cada vehículo en el instante actual
  getVehicleStates() {
    return this.vehicleRoutes.map((route) => {
      // Distancia recorrida hasta el tiempo actual
      const totalDist = route.total_distance;
      const timeForRoute = (totalDist / this.speedKmh) * 60; // minutos
      const t = Math.min(this.time, timeForRoute);
      const distNow = (t / timeForRoute) * totalDist;
      // Recorrer paradas y sumar distancias
      let accDist = 0;
      let carga = 0;
      let lastLoc = route.stops[0].location;
      for (let i = 1; i < route.stops.length; i++) {
        const currLoc = route.stops[i].location;
        const segDist = this.getDistance(lastLoc, currLoc);
        if (accDist + segDist > distNow) break;
        // Si se pasa por la parada, sumar demanda
        if (typeof route.stops[i].demand === 'number') {
          carga += route.stops[i].demand!;
        }
        accDist += segDist;
        lastLoc = currLoc;
      }
      const porcentaje = (carga / route.capacity) * 100;
      let color = 'green';
      if (porcentaje >= 100) color = 'red';
      else if (porcentaje >= 90) color = 'yellow';
      return {
        vehicle_id: route.vehicle_id,
        carga,
        porcentaje: Math.round(porcentaje),
        color,
        capacidad: route.capacity,
      };
    });
  }

  // Haversine para distancia en km
  getDistance(a: [number, number], b: [number, number]) {
    const R = 6371;
    const dLat = this.toRad(b[0] - a[0]);
    const dLon = this.toRad(b[1] - a[1]);
    const lat1 = this.toRad(a[0]);
    const lat2 = this.toRad(b[0]);
    const x = dLon * Math.cos((lat1 + lat2) / 2);
    const y = dLat;
    return Math.sqrt(x * x + y * y) * R;
  }
  toRad(deg: number) {
    return (deg * Math.PI) / 180;
  }
}
