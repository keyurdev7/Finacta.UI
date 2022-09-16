import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { File } from 'src/app/models/file.model';
import * as commonConstants from 'src/app/shared/constants/common.constant';

@Component({
  selector: 'app-delete-folder-modal',
  templateUrl: './delete-folder-modal.component.html',
  styleUrls: ['./delete-folder-modal.component.scss'],
})
export class DeleteFolderModalComponent implements OnInit {
  public constants = commonConstants;
  constructor(
    @Inject(MAT_DIALOG_DATA) public fileData: File,
    public dialogRef: MatDialogRef<DeleteFolderModalComponent>
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
