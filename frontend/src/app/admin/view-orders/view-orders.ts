import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-orders',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './view-orders.html',
  styles: ``,
})
export class ViewOrders {
  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  orders: any[] = [];
  totalRevenue = 0;
  totalOrders = 0;
  totalItems = 0;
  placedOrders = 0;
  returnedOrders = 0;

  isModalOpen:boolean = false;
  selectedOrder:any = null;

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
    } catch (err) { console.log(err) }
  }

  calculateStats() {
    this.totalOrders = this.orders.length;
    this.totalItems = this.orders.reduce((sum, order) => {
      return sum + order.items.reduce((s: number, item: any) => s + item.quantity, 0);
    }, 0);
    this.placedOrders = this.orders.filter(o => o.status === 'Placed').length;
    this.returnedOrders = this.orders.filter(o => o.status === 'Returned').length;
    this.totalRevenue = this.orders.reduce((sum, o) => sum + o.pricing.total, 0)
  }

  openModal(order:any) {this.selectedOrder = order;this.isModalOpen = true;}
  closeModal() {this.isModalOpen = false;this.selectedOrder = null}
  toggleModal() {this.isModalOpen = !this.isModalOpen;}

  deleteOrder(id: string) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this Order?')) return;
    this.http.delete(`${environment.apiURL}/orders/${id}`).subscribe(
      ()=> {
        this.orders = this.orders.filter(o=>o._id !== id);
      this.snackBar.open('product deleted succesfully! ✅', 'close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
      }
    )
    this.loadOrders();
    this.isModalOpen = false;
    // this.http.get<[]>(`${environment.apiURL}/orders`).reload();
//  this.orders.productResource.reload();
  }

}
