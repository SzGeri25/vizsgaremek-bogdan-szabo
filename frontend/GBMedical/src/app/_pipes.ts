// src/app/_pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true // Fontos, ha standalone komponenseket használsz
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100, completeWords: boolean = false, ellipsis: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }
    
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
      if (limit === -1) {
        return value; // Ha nem talál szóközt, visszaadja az egészet
      }
    }
    
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}