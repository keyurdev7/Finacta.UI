import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-term-confirmation',
  templateUrl: './delete-term-confirmation.component.html',
  styleUrls: ['./delete-term-confirmation.component.scss']
})
export class DeleteTermConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteTermConfirmationComponent>
  ) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
