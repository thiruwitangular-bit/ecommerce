import { Component } from '@angular/core';
import { ProductGridItem } from "./product-grid-item/product-grid-item";

@Component({
  selector: 'app-products-grid',
  imports: [ProductGridItem],
  templateUrl: './products-grid.html',
  styles: ``,
})
export class ProductsGrid {

}
