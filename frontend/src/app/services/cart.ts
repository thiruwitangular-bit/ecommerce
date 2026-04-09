import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../model/product';
import { CartItem } from '../model/cart-item';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartItems = signal<CartItem[]>([]);
  private snackBar = inject(MatSnackBar)

  cartCount = computed(()=>
  this.cartItems().reduce((total,item)=>total+item.quantity,0)
  )

addtoCart(product:Product,quantity:number): 'added'| 'updated' | 'limit' {
const existing = this.cartItems().find(p=>p._id===product._id);

if (existing) {
  if (quantity > product.stock) {
return 'limit'
  }
  existing.quantity = quantity;
  this.cartItems.update(items=>[...items]);
  return 'updated'
} else {
  this.cartItems.update(items=>[
    ...items,
    {...product, quantity}
  ]);
  return 'added'
}
}

incrementqty(id: string) {
this.cartItems.update(items=>
items.map((item:any)=>{
  if(item._id===id) {
    if(item.quantity >= item.stock) {
      this.snackBar.open('Stock limit reached!','close',{
        duration:3000,
        horizontalPosition:'center',
        verticalPosition:'top'
      }) 
      return item
    }
    return {...item, quantity:item.quantity+1}
  }
  return item;
})
);
}

decrementQty(id:string) {
this.cartItems.update(items=>
  items.map((item:any)=>{
    if(item._id===id) {
      if (item.quantity <= 1) return item;

      return {...item, quantity:item.quantity-1}
    }
    return item;
  })
);
}

removeFromcart(id:string) {
this.cartItems.update(items=>items.filter(p=>p._id !== id))
}

clearCart() {
  this.cartItems.set([])
}

//subtotal
subTotal = computed(()=>
this.cartItems().reduce(
  (total,item)=>total + (item.price * item.quantity),0
)
);
//shipping
shipping = computed(()=>{
  const sub = this.subTotal();
  return sub === 0 || sub >5000 ? 0 : 250 // free above 5000
});
//tax
tax = computed(()=> {
  return this.subTotal() * 0.05;
})
//final Total
total = computed(()=>{
  return this.subTotal() + this.shipping() + this.tax();
})
  
}
