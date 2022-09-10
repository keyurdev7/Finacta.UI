import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-company-dialog',
  templateUrl: './delete-company-dialog.component.html',
  styleUrls: ['./delete-company-dialog.component.scss']
})
export class DeleteCompanyDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteCompanyDialogComponent>) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
