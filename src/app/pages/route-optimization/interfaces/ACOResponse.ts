export interface Stop {
  type: 'depot' | 'pickup' | 'delivery';
  location: [number, number];
  demand?: number;
  order_id?: number;
  customer?: string;
}

export interface Route {
  vehicle_id: number;
  capacity: number;
  max_distance: number;
  total_distance: number;
  stops: Stop[];
}

export interface ACOResponse {
  best_distance: number;
  routes: Route[];
}
