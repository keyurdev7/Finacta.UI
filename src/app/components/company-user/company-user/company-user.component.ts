import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
  displayedColumns: string[] = ['name', 'email', 'invitationStatus', 'userActiveStatus'];
  companyUserDataSource: MatTableDataSource<CompanyUser> = new MatTableDataSource<CompanyUser>();
  
  constructor(
    private companyUserService: CompanyUsersService,
    public store: Store<AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.getCompanyUsers();
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
