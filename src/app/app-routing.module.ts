import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guard/admin.guard';
import { ContentLayoutComponent } from './shared/layout-components/layout/content-layout/content-layout.component';
import { ErrorLayoutComponent } from './shared/layout-components/layout/error-layout/error-layout.component';
import { FullLayoutComponent } from './shared/layout-components/layout/full-layout/full-layout.component';
import { LandingPageLayoutComponent } from './shared/layout-components/layout/landingpage-layout/landingpage-layout.component';
import { SwitcherLayoutComponent } from './shared/layout-components/layout/switcher-layout/switcher-layout.component';
import { customRoute } from './shared/routes/custom.routes';
import { errorRoute } from './shared/routes/error.routes';
import { LandingPage } from './shared/routes/landingpage';
import { content } from './shared/routes/routes copy';
import { switcher } from './shared/routes/switchers';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  // // Vertical layout
  {
    path: '',
    component: ContentLayoutComponent,
    canActivateChild: [AdminGuard],
    children: content,
  },
  {
    path: '',
    component: SwitcherLayoutComponent,
    canActivateChild: [AdminGuard],
    children: switcher,
  },
  {
    path: '',
    component: ErrorLayoutComponent,
    canActivateChild: [AdminGuard],
    children: errorRoute,
  },
  {
    path: '',
    component: LandingPageLayoutComponent,
    canActivateChild: [AdminGuard],
    children: LandingPage,
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivateChild: [AdminGuard],
    children: customRoute,
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./shared/shared.module').then((m) => m.SharedModule),
  },
  {
    path: '**',
    redirectTo: '/error-pages/error-404',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
