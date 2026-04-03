import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './view-orders.html',
  styles: ``,
})
export class ViewOrders {
  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef);
  orders:any[] = [];
  totalRevenue = 0;
totalOrders = 0;
totalItems = 0;
placedOrders = 0;
returnedOrders = 0;

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
 try {
      this.orders = await firstValueFrom(
        this.http.get<[]>(`${environment.apiURL}/orders`)
      );
      this.calculateStats()
      this.cd.detectChanges()
      console.log('orders', this.orders)
    } catch (err) {console.log(err)}
  }

  calculateStats() {

  this.totalOrders = this.orders.length;

  this.totalItems = this.orders.reduce((sum, order) => {
    return sum + order.items.reduce((s: number, item: any) => s + item.quantity, 0);
  }, 0);

  this.placedOrders = this.orders.filter(o => o.status === 'Placed').length;

  this.returnedOrders = this.orders.filter(o => o.status === 'Returned').length;
    this.totalRevenue = this.orders.reduce((sum,o)=>sum+o.pricing.total,0)


}

}
