import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-blog-preview-modal',
  templateUrl: './blog-preview-modal.component.html',
  styleUrls: ['./blog-preview-modal.component.scss'],
})
export class BlogPreviewModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<BlogPreviewModalComponent>) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
