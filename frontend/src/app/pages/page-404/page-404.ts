import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-page-404',
  imports: [RouterLink],
  template: `
<div class="to-black my-5 flex items-center justify-center">
  <div class="text-center px-2">
    
    <!-- 404 Text -->
    <h3 class="text-8xl font-extrabold tracking-widest animate-pulse">404</h3>

    <!-- Glow line -->
    <div class="bg-purple-500 h-1 w-24 mx-auto my-6 rounded animate-bounce"></div>

    <!-- Message -->
    <p class="text-xl md:text-2xl mb-6 opacity-80">
      Oops! The page you're looking for vanished into the void.
    </p>

    <!-- Animated Circle -->
    <div class="flex justify-center mb-8">
      <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center animate-spin-slow">
        <span class="text-4xl">🚀</span>
      </div>
    </div>

    <!-- Button -->
    <button routerLink="/"
      class="px-5 py-2.5 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
      Go Home
    </button>

  </div>
</div>
  `,
  styles: ``,
})
export class Page404 {

}
