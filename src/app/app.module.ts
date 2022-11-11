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
import {
  blogReducer,
  hydrationMetaReducer,
  categoryReducer,
  userReducer,
  stripeReducer,
} from './store/app.reducer';
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
import { BlogSidebarComponent } from './components/blog-management/blog-sidebar/blog-sidebar.component';
import { FileManagementComponent } from './components/file-management/file-management/file-management.component';
import { AddFolderModalComponent } from './components/file-management/add-folder-modal/add-folder-modal.component';
import { DeleteFolderModalComponent } from './components/file-management/delete-folder-modal/delete-folder-modal.component';
import { AddFileComponent } from './components/file-management/add-file/add-file.component';
import { ActiveInactiveUserModalComponent } from './components/company-user/active-inactive-user-modal/active-inactive-user-modal.component';
import { TermListComponent } from './components/term-management/term-list/term-list.component';
import { AddTermComponent } from './components/term-management/add-term/add-term.component';
import { TermsViewComponent } from './components/term-management/terms-view/terms-view.component';
import { DeleteTermConfirmationComponent } from './components/term-management/delete-term-confirmation/delete-term-confirmation.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { SettingsManagementHomeComponent } from './components/settings-management/settings-management-home/settings-management-home.component';
import { CustomerListComponent } from './components/settings-management/customer-list/customer-list.component';
import { MappedCompanyDialogComponent } from './components/settings-management/mapped-company-dialog/mapped-company-dialog.component';
import { MapXeroContactDialogComponent } from './components/company-management/map-xero-contact-dialog/map-xero-contact-dialog.component';
import { CopyToCustomerModalComponent } from './components/file-management/copy-to-customer-modal/copy-to-customer-modal.component';
import { DocPreviewModalComponent } from './components/file-management/doc-preview-modal/doc-preview-modal.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { ChatComponent } from './components/chat/chat.component';
import { ChatListComponent } from './components/chat/chat-list/chat-list.component';
import { AddChatFileComponent } from './components/chat/add-chat-file/add-chat-file.component';
import { InViewportModule } from 'ng-in-viewport';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

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
    BlogSidebarComponent,
    FileManagementComponent,
    AddFolderModalComponent,
    DeleteFolderModalComponent,
    AddFileComponent,
    ActiveInactiveUserModalComponent,
    TermListComponent,
    AddTermComponent,
    TermsViewComponent,
    DeleteTermConfirmationComponent,
    InvoicesComponent,
    SettingsManagementHomeComponent,
    CustomerListComponent,
    MappedCompanyDialogComponent,
    MapXeroContactDialogComponent,
    CopyToCustomerModalComponent,
    DocPreviewModalComponent,
    ChatComponent,
    ChatListComponent,
    AddChatFileComponent,
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
    NgxDocViewerModule,
    NgbModule,
    PerfectScrollbarModule,
    InViewportModule,
    SimpleNotificationsModule.forRoot(),
    ToastrModule.forRoot({ positionClass: 'toast-top-center' }),
    StoreModule.forRoot(
      {
        user: userReducer,
        blog: blogReducer,
        category: categoryReducer,
        stripeKey: stripeReducer,
      },
      { metaReducers: [hydrationMetaReducer] }
    ),
    QuillModule.forRoot(),
  ],
  providers: [
    ColorPickerService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
