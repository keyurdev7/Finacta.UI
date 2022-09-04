import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  public selectedCompany: number = 0;
  public user: User = new User();
  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
      if(res.userCompany){
        this.selectedCompany = res.userCompany[0]?.companyId;
      }
    });
  }

  signout() {
    const user = new User();
    delete user.isPortalSubscibe;
    this.store.dispatch(UpdateUserAction(user));
    this.router.navigate(['/auth/login']);
  }
}
