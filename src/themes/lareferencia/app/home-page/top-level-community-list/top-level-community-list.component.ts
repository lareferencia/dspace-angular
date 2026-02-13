import { AsyncPipe, CommonModule } from '@angular/common'; // Added CommonModule for ngClass etc
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Added RouterLink
import { TranslateModule } from '@ngx-translate/core';

import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
// import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'], // Pointing to local SCSS
  templateUrl: './top-level-community-list.component.html', // Pointing to local HTML
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    // ObjectCollectionComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
    RouterLink, // Import RouterLink for the cards
    CommonModule // Import CommonModule
  ],
})
export class TopLevelCommunityListComponent extends BaseComponent {
}
