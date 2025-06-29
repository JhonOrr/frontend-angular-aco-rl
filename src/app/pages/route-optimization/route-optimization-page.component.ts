import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { AcoParametersComponent } from './components/aco-parameters/aco-parameters.component';
import { ACOResponse } from './interfaces/ACOResponse';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-optimization',
  standalone: true,
  templateUrl: './route-optimization-page.component.html',
  imports: [AcoParametersComponent, FormsModule],
})
export class RouteOptimizationPageComponent implements AfterViewInit {
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private routeLayer = L.layerGroup();
  acoResponse: ACOResponse | null = null;
  vehicleOptions: { id: number; label: string }[] = [];
  selectedVehicleId: number | null = null;

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    const baseMapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map');
    L.tileLayer(baseMapURL, {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Centrar mapa en Lima inicialmente
    this.map.setView([-12.087, -76.9718], 11);

    // Agregar capas para marcadores y rutas
    this.markersLayer.addTo(this.map);
    this.routeLayer.addTo(this.map);
  }

  testOutput(res: ACOResponse) {
    this.acoResponse = res;
    // Crear opciones para el selector de vehículos
    this.vehicleOptions = res.routes.map(route => ({
      id: route.vehicle_id,
      label: `Vehículo ${route.vehicle_id}`
    }));

    // Seleccionar el primer vehículo por defecto
    if (this.vehicleOptions.length > 0) {
      this.selectedVehicleId = this.vehicleOptions[0].id;
      this.drawSelectedRoute();
    }
  }

  onVehicleChange() {
    this.drawSelectedRoute();
  }

  private drawSelectedRoute() {
    if (!this.acoResponse || this.selectedVehicleId === null) return;

    // Limpiar marcadores y rutas anteriores
    this.markersLayer.clearLayers();
    this.routeLayer.clearLayers();

    // Convertir selectedVehicleId a número (es importante!)
    const selectedId = Number(this.selectedVehicleId);

    // Encontrar la ruta del vehículo seleccionado
    const vehicleRoute = this.acoResponse.routes.find(
      r => r.vehicle_id === selectedId // Comparar con número
    );

    if (!vehicleRoute) return;

    // Extraer coordenadas de las paradas
    const coordinates = vehicleRoute.stops.map(stop =>
      [stop.location[0], stop.location[1]] as L.LatLngExpression
    );

    // Dibujar marcadores numerados
    coordinates.forEach((coord, index) => {
      const numberIcon = L.divIcon({
        className: '',
        html: `<div class="w-6 h-6 text-white text-sm bg-blue-600 rounded-full border-2 border-white shadow flex items-center justify-center">${
          index === coordinates.length - 1 ? "S" : index
        }</div>`,
        iconSize: [7, 7],
        iconAnchor: [7,7],
      });

      L.marker(coord, { icon: numberIcon }).addTo(this.markersLayer);
    });

    // Dibujar ruta con polilínea
    const routeLine = L.polyline(coordinates, { color: 'blue' });
    routeLine.addTo(this.routeLayer);

    // Ajustar vista al área de la ruta
    this.map.fitBounds(routeLine.getBounds());

    // Forzar actualización del mapa (a veces necesario)
    setTimeout(() => this.map.invalidateSize(), 0);
  }
}
