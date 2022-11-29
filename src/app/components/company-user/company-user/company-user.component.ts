import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CompanyUser } from 'src/app/models/company-user.model';
import { User } from 'src/app/models/user.model';
import { UserActiveInactive } from 'src/app/models/User-ActiveInactive.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { AppState, userSelector } from 'src/app/store/app.state';
import { InviteUserModalComponent } from '../invite-user-modal/invite-user-modal.component';
import { ActiveInactiveUserModalComponent } from '../active-inactive-user-modal/active-inactive-user-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import * as commonConstants from 'src/app/shared/constants/common.constant';
import { ActiveInActiveUserRequest } from 'src/app/models/active-inactive-user.model';

@Component({
  selector: 'app-company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
})
export class CompanyUserComponent implements OnInit, OnDestroy {
  public constants = commonConstants;
  user: User = new User();
  activeinactive: UserActiveInactive = new UserActiveInactive();
  activeInActiveUserRequest: ActiveInActiveUserRequest =
    new ActiveInActiveUserRequest();
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'photo',
    'firstName',
    'emailId',
    'phoneNumber',
    'lastLoginDateTime',
    'joinedDate',
    'invitationStatusName',
    'Active',
    'action',
  ];
  companyUserDataSource: MatTableDataSource<CompanyUser> =
    new MatTableDataSource<CompanyUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private companyUserService: CompanyUsersService,
    public store: Store<AppState>,
    public dialog: MatDialog,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.getCompanyUsers();
  }

  ngAfterViewInit() {
    this.companyUserDataSource.paginator = this.paginator;
    this.companyUserDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.companyUserDataSource.filter = filterValue.trim().toLowerCase();

    if (this.companyUserDataSource.paginator) {
      this.companyUserDataSource.paginator.firstPage();
    }
  }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
        if (this.constants.MASTER_USER_TYPE === this.user.userTypeId) {
          this.displayedColumns.splice(4, 0, 'userType');
          this.displayedColumns.splice(5, 0, 'companyName');
        }
      })
    );
  }

  getCompanyUsers(): void {
    this.companyUserService.getCompanyUsers().subscribe((res) => {
      this.companyUserDataSource.data = res.data;
    });
  }

  openDialog(id): void {
    const dialog = this.dialog.open(InviteUserModalComponent, {
      minWidth: '28%',
      data: id,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getCompanyUsers();
      }
      return;
    });
  }

  reSendInvite(id: number) {
    this.companyUserService.reSendInvitation(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  deleteUserModal(id: number) {
    const dialog = this.dialog.open(DeleteUserDialogComponent, {
      minWidth: '28%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'confirm') {
        this.deleteUser(id);
      }
      return;
    });
  }

  deleteUser(id: number) {
    this.companyUserService.deleteCompanyUser(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getCompanyUsers();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  activedeactiveUserModal(id, isActive): void {
    this.activeinactive.id = id;
    this.activeinactive.userActiveStatusId = isActive;
    const dialog = this.dialog.open(ActiveInactiveUserModalComponent, {
      minWidth: '28%',
      data: this.activeinactive,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'confirm') {
        this.activeInActiveUserRequest.companyid = this.user.lastLoginCompanyId;
        this.activeInActiveUserRequest.isactive = isActive;
        this.activeInActiveUserRequest.userid = id;
        this.updateUserStatus(this.activeInActiveUserRequest);
      }
      return;
    });
  }

  updateUserStatus(data: any) {
    this.companyUserService.activeInActiveUser(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getCompanyUsers();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  inActiveUser(id: number): void {
    this.activedeactiveUserModal(id, false);
    // this.blogService.unPublishBlog(id).subscribe((res) => {
    //   if (res && res.succeeded) {
    //     this.toster.success(res.message);
    //     this.getAllBlogs();
    //   } else if (res && res.errors.length) {
    //     res.errors.forEach((err) => {
    //       this.toster.error(err.errorMessage);
    //     });
    //   } else if (res && !res.succeeded && res.data) {
    //     this.toster.error(res.data);
    //   }
    // });
  }

  activeUser(id: number): void {
    this.activedeactiveUserModal(id, true);
    // this.blogService.unPublishBlog(id).subscribe((res) => {
    //   if (res && res.succeeded) {
    //     this.toster.success(res.message);
    //     this.getAllBlogs();
    //   } else if (res && res.errors.length) {
    //     res.errors.forEach((err) => {
    //       this.toster.error(err.errorMessage);
    //     });
    //   } else if (res && !res.succeeded && res.data) {
    //     this.toster.error(res.data);
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }
}
