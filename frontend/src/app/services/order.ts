import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private http = inject(HttpClient);

  getOrdersByPhone(phone:string) {
    return this.http.get<any[]>(`${environment.apiURL}/orders/${phone}`)
  }
  
}
