import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';

@Component({
  selector: 'app-map-xero-contact-dialog',
  templateUrl: './map-xero-contact-dialog.component.html',
  styleUrls: ['./map-xero-contact-dialog.component.scss'],
})
export class MapXeroContactDialogComponent implements OnInit {
  xeroContactList: any;
  selectedXeroContact: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MapXeroContactDialogComponent>,
    private companyUserService: CompanyUsersService,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.xeroContactList = this.data.list;
    this.selectedXeroContact = this.data.list.find((each) => each.selected);
  }

  /*getXeroContactList(): void {
    this.companyUserService.getXeroContactList(this.data.companyId).subscribe((res) => {
      this.xeroContactList = res.data;
    });
  }*/

  save(): void {
    this.companyUserService
      .addCompanyXeroContactRelation(
        this.data.userId,
        this.selectedXeroContact.xeroContactId,
        this.data.companyId
      )
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.selectedXeroContact = {};
          this.dialogRef.close({ event: 'success' });
          this.toster.success(res.message);
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
