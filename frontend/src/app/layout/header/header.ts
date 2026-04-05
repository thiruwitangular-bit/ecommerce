import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { SearchService } from '../../services/search-service';
import { ProductApi } from '../../services/product-api';

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
 protected searchservice = inject(SearchService);
 protected productapi = inject(ProductApi);

 isAdmin = signal(false);

 ngOnInit() {
  this.isAdmin.set(localStorage.getItem('role')==='admin')
 }

onSearch(value:string) {
  this.searchservice.setSearch(value);
}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.cd.detectChanges()
  }

  selectCategory(cat:string) {
    this.searchservice.clear();
    this.productapi.category.set(cat);
  }

  showAllProducts() {
   this.searchservice.clear();
    this.productapi.category.set('');
  }

  // isAdmin() {
  //   // let role = localStorage.getItem('role');
  //   return localStorage.getItem('role') === 'admin'
  // }
}
