import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductApi } from '../../services/product-api';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Product } from '../../model/product';
import { CartService } from '../../services/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, MatIcon, NgClass],
  templateUrl: './product-detail.html',
  styles: ``,
})
export class ProductDetail {

  private route = inject(ActivatedRoute);
  private productapi = inject(ProductApi);
  protected cartservice = inject(CartService);
  product = signal<Product | null>(null);
  private snackbar = inject(MatSnackBar);

count = signal(0);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');

      if (id) [
        this.loadProduct(id)
      ]
    })
  }

  async loadProduct(id: string) {
    try {
      this.product.set(await this.productapi.getProductById(id));
      console.log(this.product)
    } catch (err) {
      console.log(err)
    }

  }

  increment() {
    if (this.count()>=this.product()?.stock!) {
      this.snackbar.open('Maximum stock reached','close',{
      duration:3000,
      horizontalPosition:'center',
      verticalPosition:'top'
    })
      return;
    }
   this.count.update(val=>val+1)
  }

  decrement() {
    if (this.count()<=1) return;
    this.count.update(val=>val-1)
  }

  addTocart() {
    const prod = this.product();
    if (!prod) return;
    const result = this.cartservice.addtoCart(prod,this.count())

    if (result === 'added') {
    this.snackbar.open('added to Cart','close',{
      duration:3000,
      horizontalPosition:'center',
      verticalPosition:'top'
    })
  }

  if (result ==='updated') {
    this.snackbar.open('Already added in Cart','close',{
      duration:3000,
      horizontalPosition:'center',
      verticalPosition:'top'
    })
  }

  if(result ==='limit') {
     this.snackbar.open('Stock limit reached','close',{
      duration:3000,
      horizontalPosition:'center',
      verticalPosition:'top'
    })
  }

  }

}
