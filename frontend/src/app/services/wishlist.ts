import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../model/product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItems = signal<any[]>(this.loadFromstorage());
private snackbar = inject(MatSnackBar)
  items = this.wishlistItems.asReadonly();

  count = computed(()=>this.wishlistItems().length)

  //add/remove toggle
  toggle(product:Product) {
    const exists = this.wishlistItems().find(p=>p._id === product._id);

if(exists) {
this.wishlistItems.update(items=> items.filter(p=>p._id !== product._id));
this.saveTostorage();
return 'removed'

} else {
  this.wishlistItems.update(items=>[...items,product]);
this.saveTostorage();
return 'added';
  
}
  }

//check item
isInwishlist(product:Product):boolean {
return this.wishlistItems().some(p=>p._id === product._id)
}

//remove explicity
remove(productId:string) {
  this.wishlistItems.update(items=>
    items.filter(p=>p._id !== productId)
  );
this.saveTostorage();

}

private saveTostorage() {
  localStorage.setItem('wishlist',JSON.stringify(this.wishlistItems()))
}

 private loadFromstorage():any[] {
return JSON.parse(localStorage.getItem('wishlist') || '[]');
  }
}
