import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-candel-subscription-dialog',
  templateUrl: './candel-subscription-dialog.component.html',
  styleUrls: ['./candel-subscription-dialog.component.scss']
})
export class CandelSubscriptionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CandelSubscriptionDialogComponent>) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
