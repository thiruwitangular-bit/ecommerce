import { Component, inject } from '@angular/core';
import { Banner } from "../../pages/banner/banner";
import { SearchService } from '../../services/search-service';
import { ProductApi } from '../../services/product-api';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing-page',
  imports: [Banner, RouterLink],
  templateUrl: './landing-page.html',
  styles: ``,
})
export class LandingPage {
  private searchservice = inject(SearchService)
  private productapi = inject(ProductApi)

selectCategory(cat:string) {
this.searchservice.clear();
this.productapi.category.set(cat);
}

}
