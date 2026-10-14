import { Observable } from 'rxjs';
import { Property } from '../../shared/models/property.model';
import { SearchCriteria } from '../../shared/models/search-criteria';

/** Contrato de datos. En la Fase 5 se añadirá una implementación HTTP sin tocar componentes. */
export abstract class PropertyRepository {
  abstract search(criteria: SearchCriteria): Observable<Property[]>;
  abstract getById(id: string): Observable<Property | undefined>;
  abstract getByIds(ids: string[]): Observable<Property[]>;
  abstract getFeatured(limit: number): Observable<Property[]>;
  abstract getUnavailableDates(id: string): Observable<string[]>;
}