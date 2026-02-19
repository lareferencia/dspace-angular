import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Item } from '../../../../../../../../app/core/shared/item.model';
import { Bibliography, BibliographyResponse } from './bibliography.model';

/**
 * Service to fetch bibliography/citation data for items.
 * Uses HttpClient directly to avoid core DSpace data-service dependencies.
 */
@Injectable({ providedIn: 'root' })
export class ItemBibliographyService {

    constructor(private http: HttpClient) { }

    /**
     * Fetches bibliographies for the given item using its HAL link
     */
    getBibliographies(item: Item): Observable<{ bibliographies: Bibliography[]; error: boolean }> {
        const href = (item as any)?._links?.bibliography?.href;

        if (!href) {
            return of({ bibliographies: [], error: false });
        }

        return this.http.get<BibliographyResponse>(href).pipe(
            map(response => ({
                bibliographies: response?.bibliographies ?? [],
                error: false,
            })),
            catchError(() => of({ bibliographies: [], error: true })),
        );
    }
}
