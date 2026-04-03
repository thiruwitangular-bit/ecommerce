import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  // global search term
  private searchTerm = signal<string>('');
  private debounceTerm = signal<string>('');
  term = this.searchTerm.asReadonly();

  private timer:any;

  setSearch(term:string) {
    this.searchTerm.set(term);

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.debounceTerm.set(this.searchTerm())
    }, 500);
  }

  clear() {
   this.searchTerm.set('')
  }
  
}
