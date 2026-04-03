import { Component, inject, OnInit, signal } from '@angular/core';
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

// private destroy$ = new Subject<void>();



// ✅ search result
  // products = signal<any[]>([]);
  // isSearching = signal(false);

wishlist:any[] = [];

// ngOnInit(): void {
//     this.searchservice.search$.pipe(
//       debounceTime(300),
//       distinctUntilChanged(),
//       switchMap(term=> {
//         if(!term) {
//           this.isSearching.set(false);
//           return of([]);
//         }
//         this.isSearching.set(true);
//         return this.productapi.searchProducts(term).pipe(
//           catchError((err:any)=>{
//             console.log(err);
//             return of([])
//           })
//         )
//       }),
//       takeUntil(this.destroy$)
//     ).subscribe(res=>{
//        console.log('API RESULT:', res);
//       this.products.set(res)
//     });
// }

// ngOnDestroy() {
//   this.destroy$.next();
//   this.destroy$.complete();
// }
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
