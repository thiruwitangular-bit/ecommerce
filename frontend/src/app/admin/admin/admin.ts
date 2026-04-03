import { Component } from '@angular/core';
import { AddProduct } from "../add-product/add-product";
import { NgClass } from '@angular/common';
import { ViewProducts } from "../view-products/view-products";
import { ViewOrders } from "../view-orders/view-orders";

@Component({
  selector: 'app-admin',
  imports: [AddProduct, NgClass, ViewProducts, ViewOrders],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  activeTab = 'home';

  refreshOrders = 0;

  afterOrderPlaced() {
    this.refreshOrders++
  }

}
