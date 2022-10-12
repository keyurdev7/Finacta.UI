import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FileManagementService } from 'src/app/shared/services/file-management.service';

@Component({
  selector: 'app-copy-to-customer-modal',
  templateUrl: './copy-to-customer-modal.component.html',
  styleUrls: ['./copy-to-customer-modal.component.scss'],
})
export class CopyToCustomerModalComponent {
  companyControl = new FormControl(null, [Validators.required]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public companies: any[],
    public dialogRef: MatDialogRef<CopyToCustomerModalComponent>,
    private fileManagementService: FileManagementService,
    private toster: ToastrService
  ) {}

  save(): void {
    this.fileManagementService
      .copyToCustomer(this.companyControl.value || 0)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.companyControl.reset();
          this.dialogRef.close({ event: 'success' });
          this.toster.success(res.message || 'Copied Successfully');
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
