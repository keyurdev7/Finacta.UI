import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/services/settings.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { ToastrService } from 'ngx-toastr';
import { MappedCompanyDialogComponent } from '../mapped-company-dialog/mapped-company-dialog.component';
import { environment } from 'src/environments/environment';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-settings-management-home',
  templateUrl: './settings-management-home.component.html',
  styleUrls: ['./settings-management-home.component.scss']
})
export class SettingsManagementHomeComponent implements OnInit {
  success:string = "";
  xerocontactULR = environment.application_host + "/xero/index/contact";
  constructor(
    private settingService : SettingService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public toster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.success = params['success']
      if(this.success != undefined)
      {
        if(this.success == "1")
        {
          this.Success();
        }
        else if(this.success == "2")
        {
          this.SuccessSyncInvoice();
        }
      }
    });
  }

  Success() {
    Swal.fire({
      icon: 'success',
      // title: 'Congratulations!',
      text: 'Customer data sync succesfully',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#705ec8',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.router.navigate(['/Settings/']);
      } 
    });;
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
    this.settingService.getAllXeroContacts().subscribe((res) => {
      if (res && res.succeeded) {
        const dialog = new MatDialogConfig();
        dialog.width = '90%';
        dialog.data = res.data;
        this.dialog.open(CustomerListComponent, dialog);
        
        // const dialog = this.dialog.open(CompanyPaymentListComponent,{
        //   minWidth:'28%',
        // });
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });

  }

  ShowMappedCompany(){
    this.settingService.getCompaniesLinkedWithXeroContact().subscribe((res)=>{
      if(res && res.succeeded){
        const dialog = new MatDialogConfig();
        dialog.width = '25%';
        dialog.data = res.data;
        this.dialog.open(MappedCompanyDialogComponent,dialog);
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
      this.router.navigate(['/Settings/']);
    });;
  }

}
