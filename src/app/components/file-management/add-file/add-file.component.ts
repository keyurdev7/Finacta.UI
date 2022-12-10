import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddFile } from 'src/app/models/add-file.model';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { User } from 'src/app/models/user.model';
import { AppState, userSelector } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss'],
})
export class AddFileComponent implements OnInit {
  public user: User = new User();
  files: File[] = [];
  duplicateErr: boolean = false;
  override: boolean = false;
  fileCatTypeData: any = [];
  fileCategoryType: any = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    public dialogRef: MatDialogRef<AddFileComponent>,
    private store: Store<AppState>,
    private fileManagementService: FileManagementService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
    this.getFileCatTypes();
  }

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
    data.FileCategoryType = this.fileCategoryType;

    this.fileManagementService.addFile(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.duplicateErr = false;
        this.dialogRef.close({ event: 'success' });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        this.duplicateErr = false;
        res.errors.forEach((err) => {
          if (err.errorCode === 10) {
            this.duplicateErr = true;
            this.override = true;
          }
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

  getFileCatTypes() {
    this.fileManagementService.getFileCategoryTypes().subscribe(
      (res) => {
        this.fileCatTypeData = res['data'];
        this.fileCategoryType = this.fileCatTypeData[0].categoryId;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
}
