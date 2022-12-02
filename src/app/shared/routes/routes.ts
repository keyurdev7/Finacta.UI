import { Routes } from '@angular/router';
import { BlogDetailComponent } from 'src/app/components/blog-management/blog-detail/blog-detail.component';
import { BlogListComponent } from 'src/app/components/blog-management/blog-list/blog-list.component';
import { BlogManagementComponent } from 'src/app/components/blog-management/blog-management/blog-management.component';
import { CompanyListComponent } from 'src/app/components/company-management/company-list/company-list.component';
import { CompanyUserComponent } from 'src/app/components/company-user/company-user/company-user.component';
import { FileManagementComponent } from 'src/app/components/file-management/file-management/file-management.component';
import { TermListComponent } from 'src/app/components/term-management/term-list/term-list.component'
import { TermsViewComponent } from 'src/app/components/term-management/terms-view/terms-view.component'
import { InvoicesComponent } from 'src/app/components/invoices/invoices.component';
import { SettingsManagementHomeComponent } from 'src/app/components/settings-management/settings-management-home/settings-management-home.component';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { ListComponent } from 'src/app/components/promocodes/list/list.component';

export const content: Routes = [
  {
    path: 'company-users',
    component: CompanyUserComponent,
  },
  {
    path: 'company',
    component: CompanyListComponent,
  },
  {
    path: 'Chat',
    component: ChatComponent,
  },
  {
    path: 'blog-management',
    component: BlogManagementComponent,
  },
  {
    path: 'term-management',
    component: TermListComponent,
  },
  {
    path: 'terms',
    component: TermsViewComponent,
  },
  {
    path: 'Settings',
    component: SettingsManagementHomeComponent,
  },
  {
    path: 'Settings/:success',
    component: SettingsManagementHomeComponent,
  },
  {
    path: 'blog',
    component: BlogListComponent,
  },
  {
    path: 'blog/detail',
    component: BlogDetailComponent,
  },
  {
    path: 'file-management',
    component: FileManagementComponent,
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
  },
  {
    path: 'PromoCodes',
    component: ListComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'advanced-ui',
    loadChildren: () =>
      import('../../components/advanced-ui/advanced-ui.module').then(
        (m) => m.AdvancedUiModule
      ),
  },
  {
    path: 'apps',
    loadChildren: () =>
      import('../../components/apps/apps.module').then((m) => m.AppsModule),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('../../components/charts/charts.module').then(
        (m) => m.ChartsModule
      ),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('../../components/forms/forms.module').then((m) => m.FormModule),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('../../components/icons/icons.module').then((m) => m.IconsModule),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('../../components/maps/maps.module').then((m) => m.MapsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('../../components/pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'table',
    loadChildren: () =>
      import('../../components/table/table.module').then((m) => m.TableModule),
  },
  {
    path: 'ui-elements',
    loadChildren: () =>
      import('../../components/ui-elements/ui-elements.module').then(
        (m) => m.UiElementsModule
      ),
  },
  {
    path: 'utilities',
    loadChildren: () =>
      import('../../components/utilities/utilities.module').then(
        (m) => m.UtilitiesModule
      ),
  },
];
