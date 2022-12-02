import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from 'src/app/shared/services/nav.service';
import { SwitcherService } from 'src/app/shared/services/switcher.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit {
  public menuItems!: Menu[];

  constructor(
    public SwitcherService: SwitcherService,
    private router: Router,
    public navServices: NavService
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });
    this.router.events.subscribe((event: any) => {
      document.querySelector('.main-content')?.classList.add('subscription-bg');
      if (event instanceof NavigationEnd) {
        if (event.url.includes('pricing/')) {
          document
            .querySelector('.main-content')
            ?.classList.add('subscription-bg');
        } else {
          document
            .querySelector('.main-content')
            ?.classList.remove('subscription-bg');
        }
      }
    });
  }
  ngOnInit() {}

  toggleSwitcherBody() {
    this.SwitcherService.emitChange(false);
  }

  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 74;
  }
}
