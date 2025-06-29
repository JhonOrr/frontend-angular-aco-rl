import { Component, effect, inject } from '@angular/core';
import { OrdersServiceService } from '../../services/orders.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Order } from './interfaces/order';

@Component({
  selector: 'app-page-orders',
  imports: [AsyncPipe],
  templateUrl: './orders-page.component.html',
})
export class OrdersPageComponent {
  orders$!: Observable<Order[]>;

  private ordersService = inject(OrdersServiceService);

  constructor() {
    effect(() => {
      this.orders$ = this.getOrders();
    });
  }

  getOrders = (): Observable<Order[]> => {
    return this.ordersService.getOrders();
  };
}
