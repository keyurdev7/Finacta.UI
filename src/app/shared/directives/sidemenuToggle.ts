import { Directive, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';

@Directive({
  selector: '[appSidemenuToggle]',
})
export class SidemenuToggleDirective {
  private body: any = document.querySelector('body');
  private user: User = new User();
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.userSubscribe();
  }

  @HostListener('click') toggleSidemenu() {
    if (this.body.classList.contains('sidenav-toggled')) {
      this.removeClass();
      this.userSubscribe(true);
    } else {
      this.addClass();
      this.userSubscribe(false);
    }
  }

  userSubscribe(isSidebarOpen: boolean | null = null): void {
    this.store
      .pipe(userSelector)
      .pipe(first())
      .subscribe((res) => {
        this.user = res;
        if (isSidebarOpen === null && res && res.isSidebarOpen === false) {
          this.addClass();
        } else if (isSidebarOpen !== null) {
          this.store.dispatch(
            UpdateUserAction(
              Object.assign({}, this.user, {
                isSidebarOpen: isSidebarOpen,
              })
            )
          );
        }
      });
  }

  addClass(): void {
    document.querySelector('body')?.classList.add('sidenav-toggled');
  }

  removeClass(): void {
    document.querySelector('body')?.classList.remove('sidenav-toggled');
  }
}
