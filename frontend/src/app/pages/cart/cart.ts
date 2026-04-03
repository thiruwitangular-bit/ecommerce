import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart {
protected cartService = inject(CartService);

}
