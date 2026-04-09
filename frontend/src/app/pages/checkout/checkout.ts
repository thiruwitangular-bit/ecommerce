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
  imports: [FormsModule, ReactiveFormsModule, CurrencyPipe],
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
  private router = inject(Router);

  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required],
    paymentMethod: ['COD', Validators.required]
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
      this.snackBar.open('Please fill all fields', 'close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      })
      return
    }
    const method = this.checkoutForm.value.paymentMethod;
    if (method === 'COD') { this.placeCODOrder() }
    else { this.payNow() };
  }

  async placeCODOrder() {
    try {
      const items = this.cartItems().map(item => ({
        productId: item._id,
        quantity: Number(item.quantity)
      }));

      const orderData = {
        customer: this.checkoutForm.value,
        items,
        pricing: {
          subtotal: this.cartService.subTotal(),
          tax: this.cartService.tax(),
          shipping: this.cartService.shipping(),
          total: this.cartService.total()
        }
      }
      const res: any = await firstValueFrom(this.http.post(`${environment.apiURL}/orders`, orderData));
      this.snackBar.open('Order Placed Succesfully!', 'close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      })
      this.afterSuccess(res);
    } catch (err) {
      console.log(err);
      this.snackBar.open('Order Failed!', 'close', { duration: 3000 });
    }
  }

  payNow() {
    const amount = this.cartService.total();
    this.http.post(`${environment.apiURL}/payment/create-order`, { amount })
      .subscribe((order: any) => {
        const options: any = {
          key: 'rzp_test_Sax6L991ZaLkSz',
          amount: order.amount,
          currency: 'INR',
          order_id: order.id,
          redirect: false,

          handler: (response: any) => {
            this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          },
          prefill: {
            contact: this.checkoutForm.value.phone
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      })
  }

  async verifyPayment(response: any) {
    try {
      const verifyRes: any = await firstValueFrom(
        this.http.post(`${environment.apiURL}/payment/verify-payment`, response)
      );
      if (!verifyRes || !verifyRes.success) {
        this.snackBar.open('Payment verification Failed!', 'close', { duration: 3000 });
      }
      const items = this.cartItems().map(item => ({
        productId: item._id,
        quantity: Number(item.quantity)
      }));

      const orderDate = {
        customer: this.checkoutForm.value,
        items,
        pricing: {
          subtotal: this.cartService.subTotal(),
          tax: this.cartService.tax(),
          shipping: this.cartService.shipping(),
          total: this.cartService.total()
        },
        paymentMethod: 'ONLINE',
        paymentStatus: 'paid',
        paymentId: response.razorpay_payment_id
      };

      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiURL}/orders`, orderDate)
      );
      this.afterSuccess(res);

    } catch (err) {
      this.snackBar.open('Payment Failed!', 'close', { duration: 3000 });

    }
  }

  afterSuccess(res: any) {
    this.snackBar.open('Payment Success!', 'close', { duration: 3000 });

    this.cartService.clearCart();
    this.productapi.productResource.reload();
    this.router.navigate(['/order-success'], {
      queryParams: { orderId: res?.order._id }
    })
  }

}
