import { Component, inject } from '@angular/core';
import { ProductApi } from '../../services/product-api';
import { Product } from '../../model/product';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styles: ``,
})
export class AddProduct {
private productapi = inject(ProductApi);
selectedFile!: File;
imagePreview: any;
private snackBar = inject(MatSnackBar)

getEmptyProduct(): Product {
  return {
    name: '',
    category: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0
  };
}

product: Product = this.getEmptyProduct();

addproduct(form:any) {
  const formData:any = new FormData();
  
  formData.append('name',this.product.name);
  formData.append('category',this.product.category);
  formData.append('description', this.product.description);
  formData.append('price', this.product.price.toString());
  formData.append('stock', this.product.stock.toString());

  if(this.selectedFile) {
    formData.append('image',this.selectedFile)
  }

  this.productapi.addProducts(formData).then(
    ()=> {
      const preview = this.imagePreview;
      this.snackBar.open('product added Successfully! ✅', 'close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
      form.resetForm();
      this.product = this.getEmptyProduct();
      this.selectedFile = null!;
      this.imagePreview = preview;

    }
  ).catch(err=>{
    alert(`products not added ${err}`)
  })
}

onFileSelected(event:any) {
  const file = event.target.files[0]
this.selectedFile = file;

const reader = new FileReader();
reader.onload = ()=> {
  this.imagePreview = reader.result;
};
reader.readAsDataURL(file);
}
}
