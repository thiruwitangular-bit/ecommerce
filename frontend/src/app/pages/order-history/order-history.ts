import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-order-history',
  imports: [CurrencyPipe, RouterLink, DatePipe],
  templateUrl: './order-history.html',
  styles: ``,
})
export class OrderHistory {
private auth = inject(AuthService);
private orderservice = inject(OrderService);
private cd = inject(ChangeDetectorRef);

  orders: any = [];
  phone!: string;

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user?.phone) return;
    this.phone = user.phone
    this.fetchOrders();
    console.log(this.phone)
  }

  fetchOrders() {
      this.orderservice.getOrdersByPhone(this.phone)
      .subscribe((res)=>{this.orders = res; console.log(res);this.cd.detectChanges();})
    }

}
