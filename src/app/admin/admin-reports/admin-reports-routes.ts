import { Route } from '@angular/router';
import { i18nBreadcrumbResolver } from '@dspace/core/breadcrumbs/i18n-breadcrumb.resolver';

import { FilteredCollectionsComponent } from './filtered-collections/filtered-collections.component';
import { FilteredItemsComponent } from './filtered-items/filtered-items.component';
import { UserActivityReportComponent } from './user-activity/user-activity-report.component';

export const ROUTES: Route[] = [
  {
    path: 'collections',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'admin.reports.collections.title', breadcrumbKey: 'admin.reports.collections' },
    children: [
      {
        path: '',
        component: FilteredCollectionsComponent,
      },
    ],
  },
  {
    path: 'queries',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'admin.reports.items.title', breadcrumbKey: 'admin.reports.items' },
    children: [
      {
        path: '',
        component: FilteredItemsComponent,
      },
    ],
  },
    {
      path: 'user-activity',
      resolve: { breadcrumb: i18nBreadcrumbResolver },
      data: { title: 'admin.reports.user-activity.title', breadcrumbKey: 'admin.reports.user-activity' },
      children: [
        {
          path: '',
          component: UserActivityReportComponent,
        },
      ],
    },
];
