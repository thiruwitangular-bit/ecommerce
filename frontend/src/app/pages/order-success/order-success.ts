import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink],
  templateUrl: './order-success.html',
  styles: ``,
})
export class OrderSuccess {

  private route = inject(ActivatedRoute);

  orderId:string | null = null;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params=>{
      this.orderId = params.get('orderId')
  })
}

}
