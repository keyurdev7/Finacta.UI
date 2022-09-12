import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ColorPickerService } from 'ngx-color-picker';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { hydrationMetaReducer, userReducer } from './store/app.reducer';
import { TokenInterceptor } from './shared/services/token.interceptor';
import { CompanyUserComponent } from './components/company-user/company-user/company-user.component';
import { InviteUserModalComponent } from './components/company-user/invite-user-modal/invite-user-modal.component';
import { DeleteUserDialogComponent } from './components/company-user/delete-user-dialog/delete-user-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyListComponent } from './components/company-management/company-list/company-list.component';
import { AddCompanyComponent } from './components/company-management/add-company/add-company.component';
import { DeleteCompanyDialogComponent } from './components/company-management/delete-company-dialog/delete-company-dialog.component';
import { CandelSubscriptionDialogComponent } from './components/company-management/candel-subscription-dialog/candel-subscription-dialog.component';
import { CompanyPaymentListComponent } from './components/company-management/company-payment-list/company-payment-list.component';
import { BlogManagementComponent } from './components/blog-management/blog-management/blog-management.component';
import { AddEditBlogComponent } from './components/blog-management/add-edit-blog/add-edit-blog.component';
import { DeleteBlogConfirmationComponent } from './components/blog-management/delete-blog-confirmation/delete-blog-confirmation.component';
import { QuillModule } from 'ngx-quill';
import { BlogListComponent } from './components/blog-management/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-management/blog-detail/blog-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CompanyUserComponent,
    InviteUserModalComponent,
    DeleteUserDialogComponent,
    CompanyListComponent,
    AddCompanyComponent,
    DeleteCompanyDialogComponent,
    CandelSubscriptionDialogComponent,
    CompanyPaymentListComponent,
    BlogManagementComponent,
    AddEditBlogComponent,
    DeleteBlogConfirmationComponent,
    BlogListComponent,
    BlogDetailComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule,
    NgbModule,
    SimpleNotificationsModule.forRoot(),
    ToastrModule.forRoot(),
    StoreModule.forRoot(
      {
        user: userReducer,
      },
      { metaReducers: [hydrationMetaReducer] }
    ),
    QuillModule.forRoot(),
  ],
  providers: [
    ColorPickerService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
