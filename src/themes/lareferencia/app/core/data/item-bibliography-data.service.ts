import { Injectable } from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';
import { BaseDataService } from 'src/app/core/data/base/base-data.service';

import { RemoteDataBuildService } from '../../../../../app/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../../app/core/cache/object-cache.service';
import { HALEndpointService } from '../../../../../app/core/shared/hal-endpoint.service';
import { Item } from '../../../../../app/core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../../app/core/shared/operators';
import { RequestService } from '../../../../../app/core/data/request.service';
import { BibliographyData } from 'src/themes/lareferencia/app/shared/bibliography/bibliography-data.model';



@Injectable({ providedIn: 'root' })
export class ItemBibliographyService extends BaseDataService<BibliographyData> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('versions', requestService, rdbService, objectCache, halService);

  }

  getCitations(item: Item): Observable<BibliographyData> {
    return this.findByHref(item._links.bibliography.href).pipe(
      getFirstCompletedRemoteData(),
      map(res => res.payload),
    );
  }
}
