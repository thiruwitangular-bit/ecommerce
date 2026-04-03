import { Component, inject } from '@angular/core';
import { WishlistService } from '../../services/wishlist';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.html',
  styles: ``,
})
export class Wishlist {

  protected wishlistservice = inject(WishlistService)

  remove(id:string) {
    this.wishlistservice.remove(id);
  }
}
