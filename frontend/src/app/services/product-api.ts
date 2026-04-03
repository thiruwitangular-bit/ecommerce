import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../../environments/environment.development';
import { SearchService } from './search-service';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {

  products = signal<Product[]>([]);
  private http = inject(HttpClient);
  private searchservice = inject(SearchService);

  category = signal<string>('');

  // Fetch Products
  productResource = resource({
    params: ()=> ({
      term: this.searchservice.term(),
      category:this.category()
    }),
    loader:async ({params})=>{
      const {term, category} = params;

let url = `${environment.apiURL}/products`;

if (term) {
  url = `${environment.apiURL}/products/search?q=${term}`;
}

if (category) {
  url += term ? `&category=${category}`:`?category=${category}`;
}

      // const url = term
      // ? `${environment.apiURL}/products/search?q=${term}`
      // : `${environment.apiURL}/products`;

      return await firstValueFrom(this.http.get<Product[]>(url));
    }
  })

  getProducts() { 
  return this.http.get<Product[]>(`${environment.apiURL}/products`);
}

  searchProducts(q: string) {
  return this.http.get<Product[]>(`${environment.apiURL}/products/search?q=${q}`);
}

async getProductById(id:string) {
return await firstValueFrom(
  this.http.get<Product>(`${environment.apiURL}/products/${id}`)
);
  }

  // post (add products)
  async addProducts(formdata:FormData) {
    const res = await firstValueFrom(
      this.http.post<Product>(`${environment.apiURL}/products`, formdata)
    );
    this.products.update(prev=>[...prev,res]);
    this.productResource.reload();

    return res;
  }

  //updateProduct
async updateProduct(id:string,formdata:FormData) {
  return await firstValueFrom(
    this.http.put<Product>(`${environment.apiURL}/products/${id}`,formdata)
  )
}

  //delete 
  deleteProduct(id:string) {
    return firstValueFrom(this.http.delete(`${environment.apiURL}/products/${id}`))
  }
}
