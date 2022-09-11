import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-blog-confirmation',
  templateUrl: './delete-blog-confirmation.component.html',
  styleUrls: ['./delete-blog-confirmation.component.scss'],
})
export class DeleteBlogConfirmationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteBlogConfirmationComponent>
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
