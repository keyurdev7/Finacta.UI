import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/services/settings.service';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-setting-management',
  templateUrl: './setting-management.component.html',
  styleUrls: ['./setting-management.component.scss']
})
export class SettingManagementComponent implements OnInit {

  constructor(
    private settingService : SettingService
  ) { }

  ngOnInit(): void {
  }

  SyncXeroCustomer(){
    this.settingService.syncXeroContacts().subscribe((res)=>{
      console.log(res);
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result:any) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    });
  }

  ViewAllXeroCustomers(){
    this.settingService.getCompaniesLinkedWithXeroContact().subscribe((res)=>{
      console.log(res);
    });
  }

  SyncXeroInvoice(){
    this.settingService.syncXeroInvoices(10).subscribe((res)=>{
      console.log(res);
    });
  }
}
