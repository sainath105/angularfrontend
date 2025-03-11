import { Pipe, PipeTransform } from '@angular/core';
import { Associate } from './associate.model';

@Pipe({
  name: 'filter',
  pure: false 
})
export class FilterPipe implements PipeTransform {
  transform(items: Associate[] | null, filter: { programmingLanguage?: string, qualificationLevel?: string } | null): Associate[] {
    if (!items || !filter) {
      return items || []; 
    }

    return items.filter(item =>
      (!filter.programmingLanguage || item.programmingLanguage.toLowerCase() === filter.programmingLanguage.toLowerCase()) &&
      (!filter.qualificationLevel || item.qualificationLevel.toLowerCase() === filter.qualificationLevel.toLowerCase())
    );
    
  }
}
