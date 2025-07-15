import { Routes } from '@angular/router';
import { OrdersPageComponent } from './pages/orders/orders-page.component';
import { RouteOptimizationPageComponent } from './pages/route-optimization/route-optimization-page.component';
import { MetricsPageComponent } from './pages/metrics/metrics-page/metrics-page.component';

export const routes: Routes = [
  {
    path: 'orders',
    component: OrdersPageComponent
  },
  {
    path: 'route-optimization',
    component: RouteOptimizationPageComponent
  },
  {
    path: 'metrics',
    component: MetricsPageComponent
  }
];
