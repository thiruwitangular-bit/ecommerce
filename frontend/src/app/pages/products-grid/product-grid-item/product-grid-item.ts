import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductApi } from '../../../services/product-api';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wishlist';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SearchService } from '../../../services/search-service';

@Component({
  selector: 'app-product-grid-item',
  imports: [RouterLink, CurrencyPipe, NgClass],
  templateUrl: './product-grid-item.html',
  styles: ``,
})
export class ProductGridItem {
  private productapi = inject(ProductApi)
  productsResource = this.productapi.productResource;
  private cartservice = inject(CartService);
  private wishlistservice = inject(WishlistService);
private snackbar = inject(MatSnackBar);
// private searchSubject = new Subject<string>();\
private searchservice = inject(SearchService);

wishlist:any[] = [];

constructor() {
  effect(() => {
  console.log('CATEGORY:', this.productapi.category());
  console.log('TERM:', this.searchservice.term());
});
}

  onImageError(event:any) {
    event.target.src = '../../../assets/no-image.png'
  }

  addTocart(prod: any) {
  const result = this.cartservice.addtoCart(prod, 1); // ✅ always 1

  if (result === 'added') {
    this.snackbar.open('Added to Cart', 'close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  if (result === 'updated') {
    this.snackbar.open('Already added in Cart', 'close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  if (result === 'limit') {
    this.snackbar.open('Stock limit reached', 'close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}

toggleWishlist(prod:any) {
  const result = this.wishlistservice.toggle(prod)
this.snackbar.open(
  result === 'added'? 'Added to Wishlist ❤️':'removed from wishlist','close',{
  duration:2000,
  verticalPosition:'top'
})

}

isInwishlist(prod:any) {
  return this.wishlistservice.isInwishlist(prod)
}


}
