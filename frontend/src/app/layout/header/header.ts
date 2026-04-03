import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
 isMenuOpen = false;
 private cd = inject(ChangeDetectorRef);
 protected cartservice = inject(CartService);
 protected wishlistservice = inject(WishlistService);
 protected searchservice = inject(SearchService)

onSearch(value:string) {
  this.searchservice.setSearch(value);
}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.cd.detectChanges()
  }
}
