import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingService } from 'src/app/shared/services/settings.service';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-mapped-company-dialog',
  templateUrl: './mapped-company-dialog.component.html',
  styleUrls: ['./mapped-company-dialog.component.scss']
})
export class MappedCompanyDialogComponent implements OnInit {
  mappedcompany:any; 
  selectedCompanyId :number=0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingService : SettingService,
    public dialogRef: MatDialogRef<any>
  ) { 

    this.mappedcompany = data;
    console.log(this.mappedcompany)
  }

  ngOnInit(): void {
  }

  changeCompany(companyid):void{
    this.selectedCompanyId = companyid;
    console.log(this.selectedCompanyId);
  }

  SyncXeroInvoice(){
    console.log(this.selectedCompanyId);
    this.settingService.syncXeroInvoices(this.selectedCompanyId).subscribe((res)=>{
      if (res && res.succeeded) {
        this.SuccessSyncInvoice();
      }
    });
  }

  SuccessSyncInvoice() {
    Swal.fire({
      icon: 'success',
      // title: 'Congratulations!',
      text: 'Invoice data sync succesfully',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#705ec8',
    }).then((result: any) => {
    });;
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
