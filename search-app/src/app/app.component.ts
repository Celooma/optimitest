import { Component, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
@Injectable({
  providedIn: 'root'
})
export class AppComponent {
  title = 'search-app';
  result$!: Observable<any>;
  result: any;
  searchedWord!: string;
  count = 0;
  tabIndex = 0;
  lastProjectIndex =0;
  lastGroupIndex = 0;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const firstElement = document.querySelector('.selected') as HTMLElement | null;
    if(event.key == 'ArrowDown'){
      const secondElement = document.querySelector('[tabindex="2"]') as HTMLElement | null;
      if(firstElement && secondElement){
        firstElement.classList.remove('selected');
        secondElement.focus();
      }

    }
    else if(event.key == 'Enter'){
      if(firstElement) window.open(this.result[0].url);
    }
  }
  private endPoint = 'http://localhost:3000/projects';
  constructor(private http: HttpClient) {
    this.getHttpResult();
  }

  search(event: KeyboardEvent): void{
    if(event.key != 'ArrowDown' && event.key != 'ArrowUp'){
      this.getHttpResult();

    }else if(event.key == 'ArrowDown'){
      const el = document.querySelector('[tabindex="1"]') as HTMLElement | null;
      el?.focus();
    }

  }

  onInputFocus(): void{
    const el = document.querySelector('.selected') as HTMLElement | null;
    if(!el) {
     const firstIndex = document.querySelector('[tabindex="1"]') as HTMLElement | null;
     firstIndex?.classList.add('selected');
    }
  }

  getHttpResult():void{
    this.searchedWord = this.searchedWord?.trimStart();
    this.http.post(this.endPoint,{query: this.searchedWord})
    .subscribe({
      next: (data) => this.result = data,
      error: (e) => console.error(e),
      //complete: () => ,
    });
  }

  onKeydown(event: KeyboardEvent, url: string, element: Element):void{
    let index = element.attributes.getNamedItem('tabindex')?.value as any || 0;
    if(event.key == 'ArrowDown'){
       index ++;
      const nextEl = document.querySelector(`[tabindex="${index}"]`) as HTMLElement | null;
      if(nextEl) nextEl?.focus();

    }else if(event.key == 'ArrowUp'){
      index --;
      const prevEl = document.querySelector(`[tabindex="${index}"]`) as HTMLElement | null;
      if(prevEl) prevEl?.focus();
    }else if(event.key == 'Enter'){
      window.open(url);
    }
  }

  onFocus(element: HTMLElement): void{
    const firstElement = document.querySelector('.selected') as HTMLElement | null;
    if(firstElement) firstElement.classList.remove('selected');
  }

  highlightText(text: string, searchedWord: string){
    return text.replace(new RegExp(searchedWord, "gi"), match => {
      return '<span class="highlighted">' + match +  '</span>';
    });

  }


  getTabIndex(pIndex:any): number{
      if(pIndex != null){
        if(pIndex == 0){this.tabIndex = 1;}
        else{this.tabIndex ++; }

      }else{
        this.tabIndex ++;
      }
      return this.tabIndex;
  }

}


