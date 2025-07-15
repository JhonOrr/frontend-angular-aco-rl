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
  // private apiUrl =
  //   'https://backen-django-aco-rl-fgagduasagdbejh8.northcentralus-01.azurewebsites.net';

  private apiUrl = 'http://localhost:8000'

  getRoutes = (parameters: any): Observable<ACOResponse> => {
    return this.http.post<ACOResponse>(
      `${this.apiUrl}/api/run-aco/`,
      parameters
    );
  };

  getACOResult(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/get-routes/`);
  }
}
