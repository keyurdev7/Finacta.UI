import { E } from '@angular/cdk/keycodes';
import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserActiveInactive } from 'src/app/models/User-ActiveInactive.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-active-inactive-user-modal',
  templateUrl: './active-inactive-user-modal.component.html',
  styleUrls: ['./active-inactive-user-modal.component.scss']
})
export class ActiveInactiveUserModalComponent implements OnInit {
  public title:string = "";
  public message:string = "";

  activeinactive : UserActiveInactive = new UserActiveInactive();

  constructor( 
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<ActiveInactiveUserModalComponent>
    ) 
  {
    this.activeinactive = data;
  }

  ngOnInit(): void {
    if(this.activeinactive.userActiveStatusId == true)
    {
      this.title = "Activate User Confirmation";
      this.message = "Are you sure you would like to activate this user?";
    }
    else
    {
      this.title = "Deactivate User Confirmation";
      this.message = "Are you sure you would like to deactivate this user?";
    }
  }

  confirm(): void {
    this.dialogRef.close({ event: 'confirm' });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
