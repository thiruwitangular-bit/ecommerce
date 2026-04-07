import { Component } from '@angular/core';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './layout.html',
  styles: ``,
})
export class Layout {

  constructor() {
     console.log('Layout loaded');
  }

}
