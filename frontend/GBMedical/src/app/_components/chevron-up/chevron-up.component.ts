import { Component, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chevron-up',
  templateUrl: './chevron-up.component.html',
  styleUrls: ['./chevron-up.component.css']
})
export class ChevronUpComponent implements AfterViewInit {
  toTop!: HTMLElement;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.toTop = this.elRef.nativeElement.querySelector('.to-top');

    // Kattintási esemény hozzáadása
    this.toTop.addEventListener('click', (event: Event) => {
      event.preventDefault(); // Megakadályozza az alapértelmezett viselkedést (pl. újratöltés)
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Simán felgörget az oldal tetejére
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (window.pageYOffset > 100) {
      this.toTop.classList.add('active');
    } else {
      this.toTop.classList.remove('active');
    }
  }
}
