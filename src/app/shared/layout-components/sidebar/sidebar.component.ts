import {
  Component,
  ViewEncapsulation,
  HostListener,
  ElementRef,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { switcherArrowFn, parentNavActive, checkHoriMenu } from './sidebar';
import { fromEvent, Subscription, timer } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppState, userSelector } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { AccessMenuHeader } from 'src/app/models/access-menu-header.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  public menuItems: AccessMenuHeader[] = [];
  public url: any;
  public chatSubscription: Subscription = new Subscription();
  public routerSubscription: any;
  public windowSubscribe$!: any;
  public messageCount: number = 0;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private navServices: NavService,
    private chatService: ChatService,
    public elRef: ElementRef,
    private store: Store<AppState>
  ) {
    this.checkNavActiveOnLoad();
  }
  // To set Active on Load
  checkNavActiveOnLoad() {
    this.store.pipe(userSelector).subscribe((res) => {
      if (res.accessMenu) {
        this.menuItems = res.accessMenu;
        this.menuItems?.map((item) =>
          Object.assign({}, item, { active: true })
        );
        this.router.events.subscribe((event: any) => {
          if (event instanceof NavigationStart) {
            this.closeNavActive();
            // setTimeout(() => {
            //   let sidemenu = document.querySelectorAll(
            //     '.side-menu__item.active'
            //   );
            //   let subSidemenu = document.querySelectorAll(
            //     '.sub-side-menu__item.active'
            //   );
            //   sidemenu.forEach((e) => e.classList.remove('active'));
            //   subSidemenu.forEach((e) => e.classList.remove('active'));
            // }, 100);
          }
          if (event instanceof NavigationEnd) {
            if (
              res.accessMenu.some((e) => e.moduleName.toLowerCase() === 'chat')
            ) {
              this.chatSubscription = this.subscribeToChatUnreadCount();
            }

            res.accessMenu.filter((items: any) => {
              if (
                items.moduleName.toLowerCase() === 'chat' &&
                event.url === '/Chat'
              ) {
                this.messageCount = 0;
                this.chatSubscription.unsubscribe();
              }
              if (items.path === event.url) {
                this.setNavActive(items);
              }
              if (!items.children) {
                return false;
              }
              items.children.filter((subItems: any) => {
                if (subItems.path === event.url) {
                  this.setNavActive(subItems);
                }
                if (!subItems.children) {
                  return false;
                }
                subItems.children.filter((subSubItems: any) => {
                  if (subSubItems.path === event.url) {
                    this.setNavActive(subSubItems);
                  }
                });
                return;
              });
              return;
            });
            setTimeout(() => {
              parentNavActive();
            }, 200);
          }
        });
      }
    });
  }

  subscribeToChatUnreadCount(): Subscription {
    this.chatSubscription.unsubscribe();
    return timer(0, 30000)
      .pipe(switchMap(() => this.chatService.getUnReadMessageCount()))
      .subscribe((res) => {
        if (res && res.succeeded && res.data && res.data[0]) {
          this.messageCount = res.data;
        }
      });
  }

  checkCurrentActive() {
    this.store.pipe(userSelector).subscribe((res) => {
      this.menuItems = res.accessMenu;
      this.menuItems?.map((item) => Object.assign({}, item, { active: true }));
      let currentUrl = this.router.url;
      res.accessMenu.filter((items: any) => {
        if (items.path === currentUrl) {
          this.setNavActive(items);
        }
        if (!items.children) {
          return false;
        }
        items.children.filter((subItems: any) => {
          if (subItems.path === currentUrl) {
            this.setNavActive(subItems);
          }
          if (!subItems.children) {
            return false;
          }
          subItems.children.filter((subSubItems: any) => {
            if (subSubItems.path === currentUrl) {
              this.setNavActive(subSubItems);
            }
          });
          return;
        });
        return;
      });
    });
  }
  //Active Nav State
  setNavActive(item: any) {
    this.menuItems.filter((menuItem) => {
      if (menuItem !== item) {
        menuItem.active = false;
        document.querySelector('.app')?.classList.remove('sidenav-toggled');
        document.querySelector('.app')?.classList.remove('sidenav-toggled1');

        this.navServices.collapseSidebar = false;
      }
      // if (menuItem.children && menuItem.children.includes(item)) {
      //   menuItem.active = true;
      // }
      // if (menuItem.children) {
      //   menuItem.children.filter((submenuItems) => {
      //     if (submenuItems.children && submenuItems.children.includes(item)) {
      //       menuItem.active = true;
      //       submenuItems.active = true;
      //     }
      //   });
      // }
    });
  }

  // Toggle menu
  toggleNavActive(item: any) {
    if (!item.active) {
      this.menuItems.forEach((a: any) => {
        if (this.menuItems.includes(item)) {
          Object.assign({}, a, { active: false });
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b: any) => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
        return;
      });
    }
    Object.assign({}, item, { active: !item.active });
  }

  // Close Nav menu
  closeNavActive() {
    this.menuItems.forEach((a: any) => {
      if (this.menuItems) {
        Object.assign({}, a, { active: false });
      }
      if (!a.children) {
        return false;
      }
      a.children.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        }
      });
      return;
    });
  }
  ngOnInit(): void {
    switcherArrowFn();
    // detect screen size changes
    this.breakpointObserver
      .observe(['(max-width: 991px)'])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          // small screen
          this.checkCurrentActive();
        } else {
          // large screen
          document
            .querySelector('body.horizontal')
            ?.classList.remove('sidenav-toggled');
          if (document.querySelector('.horizontal')) {
            this.closeNavActive();
            setTimeout(() => {
              parentNavActive();
            }, 300);
          }
        }
      });

    let horizontal: any = document.querySelectorAll('#myonoffswitch35');
    let horizontalHover: any = document.querySelectorAll('#myonoffswitch111');
    fromEvent(horizontal, 'click').subscribe(() => {
      this.closeNavActive();
    });
    fromEvent(horizontalHover, 'click').subscribe(() => {
      this.closeNavActive();
    });

    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    this.windowSubscribe$ = WindowResize.subscribe(() => {
      let menuWidth: any =
        document.querySelector<HTMLElement>('.horizontal-main');
      let menuItems: any = document.querySelector<HTMLElement>('.side-menu');
      let mainSidemenuWidth: any =
        document.querySelector<HTMLElement>('.main-sidemenu');
      let menuContainerWidth =
        menuWidth?.offsetWidth - mainSidemenuWidth?.offsetWidth;
      let marginLeftValue = Math.ceil(
        Number(window.getComputedStyle(menuItems).marginLeft.split('px')[0])
      );
      let marginRightValue = Math.ceil(
        Number(window.getComputedStyle(menuItems).marginRight.split('px')[0])
      );
      let check =
        menuItems.scrollWidth +
        (0 - menuWidth?.offsetWidth) +
        menuContainerWidth;

      // to check and adjst the menu on screen size change
      if (document.querySelector('body')?.classList.contains('ltr')) {
        if (
          marginLeftValue > -check == false &&
          menuWidth?.offsetWidth - menuContainerWidth < menuItems.scrollWidth
        ) {
          menuItems.style.marginLeft = -check;
        } else {
          menuItems.style.marginLeft = 0;
        }
      } else {
        console.log(menuWidth?.offsetWidth, menuItems.scrollWidth);
        if (
          marginRightValue > -check == false &&
          menuWidth?.offsetWidth - menuContainerWidth < menuItems.scrollWidth
        ) {
          menuItems.style.marginRight = -check;
        } else {
          menuItems.style.marginRight = 0;
        }
        if (menuWidth?.offsetWidth > menuItems.scrollWidth) {
          document.querySelector('.slide-leftRTL')?.classList.add('d-none');
          document.querySelector('.slide-rightRTL')?.classList.add('d-none');
        } else {
          document.querySelector('.slide-rightRTL')?.classList.remove('d-none');
        }
      }
      checkHoriMenu();
    });
  }

  sidebarClose() {
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector('.app')?.classList.remove('sidenav-toggled');
      this.navServices.collapseSidebar = false;
    }
  }

  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 74;
  }
  ngDoCheck() {
    if (document.querySelector('.horizontal')) {
      document
        .querySelector('.horizontal .main-content')
        ?.addEventListener('click', () => {
          this.closeNavActive();
        });
    }
  }

  ngOnDestroy() {
    // unsubscribing the Observable
    this.chatSubscription.unsubscribe();
    this.windowSubscribe$.unsubscribe();
  }
}
