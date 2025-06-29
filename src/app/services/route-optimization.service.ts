import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ACOParameters } from '../pages/route-optimization/interfaces/ACOParameters';
import { Observable } from 'rxjs';
import { ACOResponse } from '../pages/route-optimization/interfaces/ACOResponse';

@Injectable({
  providedIn: 'root',
})
export class RouteOptimizationService {
  private http = inject(HttpClient);

  getRoutes = (parameters: any): Observable<ACOResponse> => {
    return this.http.post<ACOResponse>('http://localhost:8000/api/run-aco/', parameters);
  };
}

