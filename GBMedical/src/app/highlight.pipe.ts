import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTerm: string): SafeHtml {
    if (!searchTerm || !value) {
      return value;
    }
    // Keresett szó kiemelése (kis- és nagybetű független)
    const re = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedValue = value.replace(re, `<mark>$1</mark>`);

    // Biztonságos HTML tartalomként visszaadjuk
    return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
  }
}
