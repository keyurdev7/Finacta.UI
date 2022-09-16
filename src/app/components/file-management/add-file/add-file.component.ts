import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddFile } from 'src/app/models/add-file.model';
import { FileManagementService } from 'src/app/shared/services/file-management.service';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss'],
})
export class AddFileComponent implements OnInit {
  files: File[] = [];
  duplicateErr: boolean = false;
  override: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    public dialogRef: MatDialogRef<AddFileComponent>,
    private fileManagementService: FileManagementService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {}

  onSelect(event: any): void {
    this.duplicateErr = false;
    this.override = false;
    this.files = [...event.addedFiles];
  }

  onRemove(): void {
    this.duplicateErr = false;
    this.override = false;
    this.files = [];
  }

  add(): void {
    const data = new AddFile();
    data.folderId = this.id;
    data.FileName = this.files[0];
    data.Overwrite = this.override;

    this.fileManagementService.addFile(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.duplicateErr = false;
        this.dialogRef.close({ event: 'success' });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        this.duplicateErr = false;
        res.errors.forEach((err) => {
          if (err.errorCode === 10) this.duplicateErr = true;
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
