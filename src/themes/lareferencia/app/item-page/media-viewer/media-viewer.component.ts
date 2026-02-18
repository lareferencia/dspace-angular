import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { MediaViewerComponent as BaseComponent } from '../../../../../app/item-page/media-viewer/media-viewer.component';
import { ThemedMediaViewerImageComponent } from '../../../../../app/item-page/media-viewer/media-viewer-image/themed-media-viewer-image.component';
import { ThemedMediaViewerVideoComponent } from '../../../../../app/item-page/media-viewer/media-viewer-video/themed-media-viewer-video.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../app/thumbnail/themed-thumbnail.component';
import { MediaViewerPdfComponent } from './media-viewer-pdf/media-viewer-pdf.component';
import { MediaViewerItem } from '../../../../../app/core/shared/media-viewer-item.model';
import { BitstreamFormat } from '../../../../../app/core/shared/bitstream-format.model';
import { Bitstream } from '../../../../../app/core/shared/bitstream.model';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../app/core/shared/operators';

@Component({
  selector: 'ds-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['../../../../../app/item-page/media-viewer/media-viewer.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    ThemedLoadingComponent,
    ThemedMediaViewerImageComponent,
    ThemedMediaViewerVideoComponent,
    MediaViewerPdfComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class MediaViewerComponent extends BaseComponent implements OnInit {

  ngOnInit(): void {
    // Re-run the base logic but ensure we properly detect PDFs too
    // Note: Since we can't easily change the base `types` array without core changes,
    // we manually check for PDFs in the bitstream format.

    this.thumbnailsRD$ = this.loadRemoteData('THUMBNAIL');
    this.subs.push(this.loadRemoteData('ORIGINAL').subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.payload.page.length === 0) {
        this.isLoading = false;
        this.mediaList$.next([]);
      } else {
        this.subs.push(this.thumbnailsRD$.subscribe((thumbnailsRD: RemoteData<PaginatedList<Bitstream>>) => {
          for (
            let index = 0;
            index < bitstreamsRD.payload.page.length;
            index++
          ) {
            this.subs.push(bitstreamsRD.payload.page[index].format
              .pipe(getFirstSucceededRemoteDataPayload())
              .subscribe((format: BitstreamFormat) => {
                const mediaItem = this.createMediaViewerItem(
                  bitstreamsRD.payload.page[index],
                  format,
                  thumbnailsRD.payload && thumbnailsRD.payload.page[index],
                );

                // Keep existing base logic for images/videos
                const types: string[] = [
                  ...(this.mediaOptions.image ? ['image'] : []),
                  ...(this.mediaOptions.video ? ['audio', 'video'] : []),
                ];

                if (types.includes(mediaItem.format)) {
                  this.mediaList$.next([...this.mediaList$.getValue(), mediaItem]);
                }
                // CUSTOM: Always include PDFs for this theme
                else if (format.mimetype === 'application/pdf') {
                  this.mediaList$.next([...this.mediaList$.getValue(), mediaItem]);
                }
                else if (format.mimetype === 'text/vtt') {
                  this.captions$.next([...this.captions$.getValue(), bitstreamsRD.payload.page[index]]);
                }
              }));
          }
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }));
      }
    }));
  }

  filterPdf(mediaList: MediaViewerItem[]): MediaViewerItem[] {
    return (mediaList || []).filter(item => item.mimetype === 'application/pdf');
  }
}
