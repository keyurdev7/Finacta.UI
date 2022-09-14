import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FileManagementService } from 'src/app/shared/services/file-management.service';

@Component({
  selector: 'app-add-folder-modal',
  templateUrl: './add-folder-modal.component.html',
  styleUrls: ['./add-folder-modal.component.scss'],
})
export class AddFolderModalComponent implements OnInit {
  public addForm: FormGroup = new FormGroup([]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    public dialogRef: MatDialogRef<AddFolderModalComponent>,
    private fb: FormBuilder,
    private fileManagementService: FileManagementService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.addForm.controls[control]?.touched &&
      this.addForm.controls[control].errors?.[validator]
    );
  }

  add(): void {
    this.fileManagementService
      .addFolder(this.id, this.addForm.value.name)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.addForm.reset();
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

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
