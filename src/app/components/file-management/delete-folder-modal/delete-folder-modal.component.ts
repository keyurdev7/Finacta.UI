import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-folder-modal',
  templateUrl: './delete-folder-modal.component.html',
  styleUrls: ['./delete-folder-modal.component.scss'],
})
export class DeleteFolderModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteFolderModalComponent>) {}

  ngOnInit(): void {}

  delete(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
