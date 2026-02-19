import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Item } from '../../../../../../../../app/core/shared/item.model';
import { ItemBibliographyService } from './bibliography-data.service';
import { Bibliography } from './bibliography.model';

const BIBLIOGRAPHY_I18N = {
    en: {
        'item.cite.open-modal': 'Cite',
        'item.cite.modal-title': 'Cite this item',
        'item.cite.loading': 'Loading citations...',
        'item.cite.error': 'Unable to load citation data.',
        'item.cite.copy': 'Copy',
        'item.cite.copied': 'Copied!',
        'item.cite.close': 'Close',
        'item.cite.no-results': 'No citation data available.',
    },
    es: {
        'item.cite.open-modal': 'Citar',
        'item.cite.modal-title': 'Citar este ítem',
        'item.cite.loading': 'Cargando citas...',
        'item.cite.error': 'No se pudieron cargar los datos de cita.',
        'item.cite.copy': 'Copiar',
        'item.cite.copied': '¡Copiado!',
        'item.cite.close': 'Cerrar',
        'item.cite.no-results': 'No hay datos de cita disponibles.',
    },
    'pt-BR': {
        'item.cite.open-modal': 'Citar',
        'item.cite.modal-title': 'Citar este item',
        'item.cite.loading': 'Carregando citações...',
        'item.cite.error': 'Não foi possível carregar os dados de citação.',
        'item.cite.copy': 'Copiar',
        'item.cite.copied': 'Copiado!',
        'item.cite.close': 'Fechar',
        'item.cite.no-results': 'Nenhum dado de citação disponível.',
    },
};

/**
 * Component that renders a "Cite" link and opens a modal with citation data
 */
@Component({
    selector: 'ds-item-page-bibliography',
    templateUrl: './item-page-bibliography.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
    ],
})
export class ItemPageBibliographyComponent implements OnInit {

    @Input() item: Item;

    @ViewChild('bibliographyModal') bibliographyModal: TemplateRef<any>;

    bibliographies: Bibliography[] = [];
    isLoading = false;
    hasError = false;
    copiedIndex: number | null = null;

    private modalRef: NgbModalRef;

    constructor(
        private bibliographyService: ItemBibliographyService,
        private modalService: NgbModal,
        private translateService: TranslateService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        // Register bibliography translations for all supported languages
        for (const [lang, translations] of Object.entries(BIBLIOGRAPHY_I18N)) {
            this.translateService.setTranslation(lang, translations, true);
        }
    }

    /**
     * Opens the bibliography modal and fetches citation data
     */
    openModal(): void {
        this.isLoading = true;
        this.hasError = false;
        this.bibliographies = [];
        this.copiedIndex = null;

        this.modalRef = this.modalService.open(this.bibliographyModal, {
            size: 'lg',
            centered: true,
        });

        this.bibliographyService.getBibliographies(this.item).subscribe({
            next: (result) => {
                this.bibliographies = result.bibliographies;
                this.hasError = result.error;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.hasError = true;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
        });
    }

    /**
     * Copies citation text to clipboard
     */
    copyToClipboard(text: string, index: number): void {
        navigator.clipboard.writeText(text).then(() => {
            this.copiedIndex = index;
            this.cdr.markForCheck();
            setTimeout(() => {
                this.copiedIndex = null;
                this.cdr.markForCheck();
            }, 2000);
        });
    }

    /**
     * Checks if a citation style is BibTeX to apply special formatting
     */
    isBibtex(style: string): boolean {
        return style?.toLowerCase() === 'bibtex';
    }
}
