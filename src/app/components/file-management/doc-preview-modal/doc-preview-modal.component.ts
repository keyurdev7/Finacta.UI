import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { File } from 'src/app/models/file.model';
import * as commonConstants from 'src/app/shared/constants/common.constant';

@Component({
  selector: 'app-doc-preview-modal',
  templateUrl: './doc-preview-modal.component.html',
  styleUrls: ['./doc-preview-modal.component.scss'],
})
export class DocPreviewModalComponent implements OnInit {
  public constants = commonConstants;
  public docFileType: string = '';
  public fileTypes: any = {
    pdf: ['pdf'],
    word: ['doc', 'docx'],
    excel: ['xls', 'xlsx'],
    image: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'wav'],
    video: ['mp4', 'flv', 'mkv', 'mov'],
    commonFile: 'file',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public fileData: File,
    public dialogRef: MatDialogRef<DocPreviewModalComponent>
  ) {}

  ngOnInit(): void {
    const ext = this.fileData.fileType.split('.').reverse()[0];
    this.docFileType = this.fileTypes.commonFile;
    Object.keys(this.fileTypes).forEach((key) => {
      if (
        Array.isArray(this.fileTypes[key]) &&
        this.fileTypes[key].includes(ext)
      ) {
        this.docFileType = key;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
