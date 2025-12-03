import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ds-media-viewer-pdf',
  templateUrl: './media-viewer-pdf.component.html',
  styleUrls: ['./media-viewer-pdf.component.scss'],
  imports: [TranslateModule],
})
export class MediaViewerPdfComponent {
  @Input() pdfs: MediaViewerItem[];
  @ViewChild('pdfViewer') pdfViewer;
  blobUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
  currentIndex = 0;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, public dsoNameService: DSONameService, private cdr: ChangeDetectorRef,) { }

  ngOnInit() {
    console.log('initiiiiii')
    this.loadPdf(this.currentIndex);
  }

  selectedMedia(index: number) {
    this.currentIndex = index;
    this.loadPdf(index);
  }

  private loadPdf(index: number) {
    const url = this.pdfs[index].bitstream._links.content.href;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading PDF:', err);
      },
    });
  }
}
