import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ProductApi } from '../../services/product-api';
import { Router } from '@angular/router';
import { ViewOrders } from '../../admin/view-orders/view-orders';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule,ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styles: ``,
})
export class Checkout {

protected cartService = inject(CartService)
private fb = inject(FormBuilder);
private snackBar = inject(MatSnackBar);
private http = inject(HttpClient);
private auth = inject(AuthService);
private productapi = inject(ProductApi);
cartItems = this.cartService.cartItems;
private router = inject(Router)

checkoutForm = this.fb.group({
  name:['',Validators.required],
  phone:['',Validators.required],
  email:['',Validators.required],
  address:['',Validators.required],
  city:['',Validators.required],
  state:['',Validators.required],
  pincode:['',Validators.required],
  paymentMethod:['COD',Validators.required]
})

ngOnInit() {
  const user = this.auth.getUser();

  if (user) {
    this.checkoutForm.patchValue({
      phone: user.phone?.toString().trim()
    });
  }
}

async placeOrder() {
  if (this.checkoutForm.invalid) {
    this.snackBar.open('Please fill all fields', 'close',{
      duration:3000,
      verticalPosition:'top',
      horizontalPosition:'center'
    })
  return
  }
ViewOrders
  try {
    const items = this.cartItems().map(item=>({
      productId: item._id,
      quantity: Number(item.quantity)
    }));

const orderData = {
    customer: this.checkoutForm.value,
    items,
    pricing:{
    subtotal:this.cartService.subTotal(),
    tax:this.cartService.tax(),
    shipping:this.cartService.shipping(),
    total:this.cartService.total()
  }
}
const res:any = await firstValueFrom(this.http.post(`${environment.apiURL}/orders`, orderData));
this.snackBar.open('Order Placed Succesfully!', 'close',{
      duration:3000,
      verticalPosition:'top',
      horizontalPosition:'center'
    })
this.cartService.clearCart();
this.productapi.productResource.reload();
this.router.navigate(['order-success'], {
  queryParams: {orderId: res?.order._id}
})
} catch (err) {
  console.log(err);
  this.snackBar.open('Order Failed!', 'close', { duration: 3000 });
}
}

}
