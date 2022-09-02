import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CompanyUser } from 'src/app/models/company-user.model';
import { User } from 'src/app/models/user.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { AppState, userSelector } from 'src/app/store/app.state';
import { InviteUserModalComponent } from '../invite-user-modal/invite-user-modal.component';

@Component({
  selector: 'app-company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
})
export class CompanyUserComponent implements OnInit {
  user: User = new User();
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['photo','name', 'position', 'phone', 'lastLoginDateTime', 'joinedDate', 'invitationStatus', 'action'];
  companyUserDataSource: MatTableDataSource<CompanyUser> = new MatTableDataSource<CompanyUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private companyUserService: CompanyUsersService,
    public store: Store<AppState>,
    public dialog: MatDialog
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
      })
    );
  }

  getCompanyUsers(): void {
    this.companyUserService
      .getCompanyUsers(this.user.token)
      .subscribe((res) => {
        this.companyUserDataSource.data = res.data;
      });
  }

  openDialog(): void {
    const dialog = this.dialog.open(InviteUserModalComponent, {
      width: '28%'
    });
    dialog.afterClosed().subscribe(result => {
      if(result?.event === 'success'){
        this.getCompanyUsers();
      }
      return;
    });
  }
}
