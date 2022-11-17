import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingService } from 'src/app/shared/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { ToastrService } from 'ngx-toastr';
import { MappedCompanyDialogComponent } from '../mapped-company-dialog/mapped-company-dialog.component';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, userSelector } from 'src/app/store/app.state';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { ViewLogoModalComponent } from '../view-logo-modal/view-logo-modal.component';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-settings-management-home',
  templateUrl: './settings-management-home.component.html',
  styleUrls: ['./settings-management-home.component.scss'],
})
export class SettingsManagementHomeComponent implements OnInit, OnDestroy {
  success: string = '';
  subscriptions: Subscription[] = [];
  user: User = new User();
  xerocontactULR = environment.application_host + '/xero/index/contact';
  expandFile: File | null = null;
  collapseFile: File | null = null;
  expandFileErr: string = '';
  collapseFileErr: String = '';
  constructor(
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public toster: ToastrService,
    public store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.activatedRoute.params.subscribe((params) => {
      this.success = params['success'];
      if (this.success != undefined) {
        if (this.success == '1') {
          this.Success();
        } else if (this.success == '2') {
          this.SuccessSyncInvoice();
        }
      }
    });
  }

  isFormValid(): boolean {
    if (!!this.collapseFile || !!this.expandFile) {
      if (!this.expandFileErr && !this.collapseFileErr) {
        return true;
      }
      return false;
    }
    return false;
  }

  Success() {
    Swal.fire({
      icon: 'success',
      // title: 'Congratulations!',
      text: 'Customer data sync succesfully',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#705ec8',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.router.navigate(['/Settings/']);
      }
    });
  }

  SyncXeroCustomer() {
    this.settingService.syncXeroContacts().subscribe((res) => {
      console.log(res);
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result: any) => {
        if (result.isConfirmed) {
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        }
      });
    });
  }

  ViewAllXeroCustomers() {
    this.settingService.getAllXeroContacts().subscribe((res) => {
      if (res && res.succeeded) {
        const dialog = new MatDialogConfig();
        dialog.width = '90%';
        dialog.data = res.data;
        this.dialog.open(CustomerListComponent, dialog);

        // const dialog = this.dialog.open(CompanyPaymentListComponent,{
        //   minWidth:'28%',
        // });
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  ShowMappedCompany() {
    this.settingService.getCompaniesLinkedWithXeroContact().subscribe((res) => {
      if (res && res.succeeded) {
        const dialog = new MatDialogConfig();
        dialog.width = '25%';
        dialog.data = res.data;
        this.dialog.open(MappedCompanyDialogComponent, dialog);
      }
    });
  }

  SuccessSyncInvoice() {
    Swal.fire({
      icon: 'success',
      // title: 'Congratulations!',
      text: 'Invoice data sync succesfully',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#705ec8',
    }).then((result: any) => {
      this.router.navigate(['/Settings/']);
    });
  }

  expandLogoChange(event): void {
    let file: File | null = null;
    this.expandFileErr = '';
    if (event.target.files && event.target.files.length) {
      file = event.target.files[0];
      if (file && file.type && file.type.split('/')[0] !== 'image') {
        this.expandFileErr = 'Expand file should be an image file';
      } else {
        this.expandFileErr = '';
      }
    }
    this.expandFile = file;
  }

  collapseLogoChange(event): void {
    let file: File | null = null;
    this.collapseFileErr = '';
    if (event.target.files && event.target.files.length) {
      file = event.target.files[0];
      if (file && file.type && file.type.split('/')[0] !== 'image') {
        this.collapseFileErr = 'Collapse file should be an image file';
      } else {
        this.collapseFileErr = '';
      }
    }
    this.collapseFile = file;
  }

  subscribeToUser(): void {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  getLogo(): void {
    this.settingService.getLogo().subscribe((res) => {
      if (res && res.succeeded) {
        this.store.dispatch(
          UpdateUserAction(Object.assign({}, this.user, res.data))
        );
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  viewLogo(url): void {
    const dialog = this.dialog.open(ViewLogoModalComponent, {
      minWidth: '28%',
      data: url,
    });
  }

  setLogo(): void {
    let data = {};
    if (this.collapseFile) {
      data['CollapseLogo'] = this.collapseFile;
    }
    if (this.expandFile) {
      data['ExpandLogo'] = this.expandFile;
    }
    if (this.isFormValid() && !!data) {
      this.settingService.updateLogo(data).subscribe((res) => {
        if (res && res.succeeded) {
          this.collapseFile = null;
          this.expandFile = null;
          this.toster.success('Logo changed successfully');
          this.getLogo();
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }
}
