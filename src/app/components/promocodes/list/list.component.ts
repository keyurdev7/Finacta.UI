import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PromoCode } from 'src/app/models/promo-code.model';
import { PromocodeService } from 'src/app/shared/services/promocode.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, userSelector } from 'src/app/store/app.state';
import { User } from 'src/app/models/user.model';
import * as commonConstants from 'src/app/shared/constants/common.constant';
import { UpdateUserAction } from 'src/app/store/app.actions';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public constants = commonConstants;
  subscriptions: Subscription[] = [];
  user: User = new User();
  usertypeid = 0;
  displayedColumns: string[] = [
    'promoCode',
    'promoDays',
    'promoStartDate',
    'emailId',
    'status',
    'activatedDate',
    'promoEndDate',
    'action'
  ];
  activeView: boolean = true;
  promoCodeDataSource: MatTableDataSource<PromoCode> =
    new MatTableDataSource<PromoCode>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private promoCodeService: PromocodeService,
    public dialog: MatDialog,
    public toster: ToastrService,
    public router: Router,
    public store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.getAllActivePromoCodes();
    this.subscribeToUser();
  }

  ngAfterViewInit() {
    this.promoCodeDataSource.paginator = this.paginator;
    this.promoCodeDataSource.sort = this.sort;
  }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
        this.usertypeid = this.user.userTypeId;
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.promoCodeDataSource.filter = filterValue.trim().toLowerCase();

    if (this.promoCodeDataSource.paginator) {
      this.promoCodeDataSource.paginator.firstPage();
    }
  }

  viewChange(): void {
    this.activeView = !this.activeView;
    this.getData();
  }

  getData(): void {
    if(this.activeView){
      this.getAllActivePromoCodes();
    }
    else{
      this.getAllPromoCodes();
    }
  }

  getAllActivePromoCodes(): void {
    this.promoCodeService.getActivePromoCodes().subscribe((res) => {
      this.promoCodeDataSource.data = res.data;
    });
  }

  getAllPromoCodes(): void {
    this.promoCodeService.getAllPromoCodes().subscribe((res) => {
      this.promoCodeDataSource.data = res.data;
    });
  }

  addPromocode(): void {
    // const dialog = this.dialog.open(AddCompanyComponent, {
    //   minWidth: '28%',
    // });
    // dialog.afterClosed().subscribe((result) => {
    //   if (result?.event === 'success') {
    //     this.subscriptionPay(result.data);
    //   }
    //   return;
    // });
  }
  
  edit(id: number): void {
    const editData = this.promoCodeDataSource.data.find(rec => rec.promoCodeId === id);
    console.log(editData);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this promo code',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.promoCodeService.deletePromoCode(id).subscribe((res) => {
          if (res && res.succeeded) {
            this.toster.success(res.message);
            this.getData();
          } else if (res && res.errors.length) {
            res.errors.forEach((err) => {
              this.toster.error(err.errorMessage);
            });
          } else if (res && !res.succeeded && res.data) {
            this.toster.error(res.data);
          }
        });
      }
    });
  }

  activate(id: number): void {
    this.promoCodeService.ActivatePromoCode(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getData();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }
}

