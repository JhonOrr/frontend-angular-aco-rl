import { Component, effect, inject, signal } from '@angular/core';
import { OrdersServiceService } from '../../services/orders.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Order } from './interfaces/order';
import { CustomDialogComponent } from "../../components/shared/custom-dialog/custom-dialog.component";

@Component({
  selector: 'app-page-orders',
  imports: [AsyncPipe, CustomDialogComponent],
  templateUrl: './orders-page.component.html',
})
export class OrdersPageComponent {
  orders$!: Observable<Order[]>;

  openAddForm = signal<boolean>(false);

  private ordersService = inject(OrdersServiceService);

  constructor() {
    effect(() => {
      this.orders$ = this.getOrders();
    });
  }

  getOrders = (): Observable<Order[]> => {
    return this.ordersService.getOrders();
  };

  openAddOrderForm = (): void =>{
    this.openAddForm.set(true);
  }
}
