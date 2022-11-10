import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-add-chat-file',
  templateUrl: './add-chat-file.component.html',
  styleUrls: ['./add-chat-file.component.scss'],
})
export class AddChatFileComponent implements OnInit {
  files: File[] = [];
  duplicateErr: boolean = false;
  override: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    public dialogRef: MatDialogRef<AddChatFileComponent>,
    private chatService: ChatService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {}

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
    const data = {
      AttachmentName: this.files[0],
      SelecteUserId: this.id,
    };

    this.chatService.sendChat(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.duplicateErr = false;
        this.dialogRef.close({ event: 'success' });
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
}
