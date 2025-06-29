import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../pages/orders/interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersServiceService {
  private http = inject(HttpClient);

  getOrders = (): Observable<Order[]> => {
    return this.http.get<Order[]>('http://localhost:8000/api/orders/');
  };
}
