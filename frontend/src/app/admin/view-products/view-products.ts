import { Component, inject } from '@angular/core';
import { ProductApi } from '../../services/product-api';
import { FormsModule } from '@angular/forms';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../model/product';
import { environment } from '../../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-products',
  imports: [FormsModule,CurrencyPipe],
  templateUrl: './view-products.html',
  styles: ``,
})
export class ViewProducts {

  private productapi = inject(ProductApi)
  productsResource = this.productapi.productResource;
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar)
  selectedProduct: any = null;

  editProduct(product: any) {
    this.selectedProduct = { ...product }; // clone
  }


  async updateProduct() {
    if (!this.selectedProduct?._id) return;

    const formData = new FormData();

    formData.append('name', this.selectedProduct.name);
    formData.append('category', this.selectedProduct.category);
    formData.append('description', this.selectedProduct.description);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('imageUrl', this.selectedProduct.imageUrl);
    formData.append('stock', this.selectedProduct.stock.toString());

    try {
      await this.productapi.updateProduct(this.selectedProduct._id, formData);
      this.productapi.productResource.reload();
      this.snackBar.open('Product updated successfully! ✅', 'close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success-snackbar']
    });

      // same as delete
      this.selectedProduct = null;
    } catch (err) {
      console.log('error ' + err);
      alert('Update Failed!');
    }
  }

  deleteProduct(id: string) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productapi.deleteProduct(id)
      .then(() => {
        this.snackBar.open('product deleted succesfully! ✅', 'close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
        this.productapi.productResource.reload();
      }).catch(err => {
        console.log('error' + err);
        alert('delete Failed!.')
      })
  }

}
