import {
  Component,
  Input,
} from '@angular/core';
import {
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { map, tap } from 'rxjs';
import { ItemBibliographyService } from 'src/themes/lareferencia/app/core/data/item-bibliography-data.service';
import { Item } from 'src/app/core/shared/item.model';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';

import { Bibliography } from './bibliography.model';
import { BibliographyData } from './bibliography-data.model';


@Component({
  selector: 'ds-item-bibliography',
  templateUrl: './bibliography.component.html',
  standalone: true,
  imports: [
    NgbModalModule,
    TranslateModule,
  ],
})
export class BibliographyComponent {
  @Input() item: Item;
  bibliographies: Bibliography[] = [];
  loading = false;
  error = false;

  constructor(
    private bibliographyService: ItemBibliographyService,
    private modalService: NgbModal,
  ) {
  }

  openModal(content: any) {
    this.loading = true;
    this.error = false;

    this.bibliographyService.getCitations(this.item).subscribe({
      next: (bibliographyData: BibliographyData) => {
        console.log('payload', bibliographyData);
        this.bibliographies = bibliographyData?.bibliographies || [];
        this.loading = false;
        this.modalService.open(content, { size: 'lg' });
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error(err);
      }
    });
  }

  copyToClipboard(value: string) {
    // Remove any HTML tags if needed:
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    const plainText = tempElement.textContent || tempElement.innerText || '';

    navigator.clipboard.writeText(plainText).then(
      () => {
        console.log('Copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  }
}
