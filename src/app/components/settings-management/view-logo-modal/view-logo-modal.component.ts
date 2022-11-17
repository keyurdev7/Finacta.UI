import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-logo-modal',
  templateUrl: './view-logo-modal.component.html',
  styleUrls: ['./view-logo-modal.component.scss'],
})
export class ViewLogoModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public fileurl: string,
    public dialogRef: MatDialogRef<ViewLogoModalComponent>
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
