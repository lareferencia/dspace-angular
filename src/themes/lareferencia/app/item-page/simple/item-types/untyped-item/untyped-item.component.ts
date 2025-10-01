import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { ViewMode } from 'src/app/core/shared/view-mode.model';
import { CollectionsComponent } from 'src/app/item-page/field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from 'src/app/item-page/media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from 'src/app/item-page/mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from 'src/app/item-page/simple/field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageCcLicenseFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { ItemPageDateFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { GeospatialItemPageFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/geospatial/geospatial-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageUriFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';
import { UntypedItemComponent as BaseComponent } from 'src/app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { ThemedMetadataRepresentationListComponent } from 'src/app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { DsoEditMenuComponent } from 'src/app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from 'src/app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from 'src/app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from 'src/app/thumbnail/themed-thumbnail.component';
import { BibliographyComponent } from 'src/themes/lareferencia/app/shared/bibliography/bibliography.component';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-themed-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    BibliographyComponent,
    CollectionsComponent,
    DsoEditMenuComponent,
    GenericItemPageFieldComponent,
    GeospatialItemPageFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageCcLicenseFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageUriFieldComponent,
    MetadataFieldWrapperComponent,
    MiradorViewerComponent,
    RouterLink,
    ThemedFileSectionComponent,
    ThemedItemPageTitleFieldComponent,
    ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class UntypedItemComponent extends BaseComponent {}
