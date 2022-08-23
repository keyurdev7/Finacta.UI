import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ServiceComponent } from './service/service.component';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { SwitcherComponent } from './switcher/switcher.component';
import { TermsComponent } from './terms/terms.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PricingComponent } from './pricing/pricing.component';
import { BlogModule } from './blog/blog.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerModule } from 'ngx-color-picker';
import { IvyGalleryModule } from 'angular-gallery';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    ServiceComponent,
    AboutCompanyComponent,
    SwitcherComponent,
    TermsComponent,
    FaqsComponent,
    PricingComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    BlogModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    ColorPickerModule,
    IvyGalleryModule,
    RouterModule,
  ],
  exports: [SwitcherComponent],
})
export class PagesModule {}
