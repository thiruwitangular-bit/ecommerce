import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { SearchService } from '../../services/search-service';
import { ProductApi } from '../../services/product-api';

@Component({
  selector: 'app-banner',
  imports: [RouterLink],
  template: `
   <div class="p-4">
      <div class="max-w-screen-xl mx-auto">
        <div class="rounded-2xl banner-container px-6 py-8 sm:py-14">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Discover Amazing Products</h2>
            <p class="text-lg text-slate-600">Transform your experience with our innovative solutions</p>
            <button routerLink="/products" (click)="showAllproducts()" class="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-purple-700 cursor-pointer transition mt-8">
              Shop Now
            </button>
          </div>

           <div class="mt-8">
            <ul class="flex items-center justify-center mt-6 gap-4">
              <li>
             <a href='javascript:void(0)'>
            <i class="fa-brands fa-facebook text-xl"></i>
            </a>
              </li>
              <li>
              <a href='javascript:void(0)'>
            <i class="fa-brands fa-instagram text-xl"></i>
            </a>
              </li>
              <li>
               <a href='javascript:void(0)'>
            <i class="fa-brands fa-whatsapp text-xl"></i>
            </a>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
  .banner-container {
  width: 100%;          /* full width of container */
  height: 300px;        /* set desired height */
  background-image: url('/webBanner2.png');
  background-size: cover;      /* cover container, maintain aspect ratio */
  background-position: center; /* center the image */
  background-repeat: no-repeat; /* prevent tiling */
  overflow: hidden;            /* optional: hide any overflow */
}
  `,
})
export class Banner {
private productapi = inject(ProductApi)
  private searchservice = inject(SearchService)
  showAllproducts() {
    this.searchservice.clear();
    this.productapi.category.set('')
  }
}
