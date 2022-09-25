import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { AppState, userSelector } from 'src/app/store/app.state';
import { SwitcherService } from '../../services/switcher.service';
import * as switcher from './switcher';
import { APIService } from '../../services/api.service';
import { UpdateUserAction } from 'src/app/store/app.actions';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
})
export class SwitcherComponent implements OnInit {
  layoutSub: Subscription;

  body = document.querySelector('body');
  private user: User = new User();

  @ViewChild('switcher', { static: false }) switcher!: ElementRef;
  constructor(
    public renderer: Renderer2,
    public switcherServic: SwitcherService,
    private api: APIService,
    private store: Store<AppState>
  ) {   
    this.layoutSub = switcherServic.changeEmitted.subscribe((value) => {
      if (value) {
        this.renderer.addClass(this.switcher.nativeElement.firstElementChild,'active');
        this.renderer.setStyle(this.switcher.nativeElement.firstElementChild,'right','0px');
        value = true;
      } else {
        this.renderer.removeClass(this.switcher.nativeElement.firstElementChild,'active');
        this.renderer.setStyle(this.switcher.nativeElement.firstElementChild,'right','-270px');
        value = false;
      }
    });
  }
  ngOnInit(): void {
    switcher.localStorageBackUp();
    switcher.customClickFn((e) => this.updateUserTheme(e));
    switcher.updateChanges();

    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
      this.user.userTheme.layout_Position !== 'scroll'
        ? switcher.fixedLayoutFn()
        : switcher.scrollLayoutFn();
      this.user.userTheme.menu_Style !== 'dark'
        ? switcher.lightMenuFn()
        : switcher.darkMenuFn();
      this.user.userTheme.header_Style !== 'dark'
        ? switcher.lightHeaderFn()
        : switcher.darkHeaderFn();
    });

  }

  updateUserTheme(data: any): void {
    const theme = Object.assign({}, this.user.userTheme, data);
    this.api.updateUserTheme(theme).subscribe(() => {
      this.store.dispatch(
        UpdateUserAction(
          Object.assign({}, this.user, {
            userTheme: theme,
          })
        )
      );
    });
  }
  
  reset(){
    localStorage.clear(); 
    let html:any = document.querySelector('html')
    let body = document.querySelector('body')
    html.style = ''; 
    body?.classList.remove('rtl');
    body?.classList.remove('dark-mode');
    body?.classList.remove('light-header');
    body?.classList.remove('dark-header');
    body?.classList.remove('color-header');
    body?.classList.remove('gradient-header');
    body?.classList.remove('light-menu');
    body?.classList.remove('color-menu');
    body?.classList.remove('dark-menu');
    body?.classList.remove('gradient-menu');
    body?.classList.remove('layout-boxed');
    body?.classList.remove('scrollable-layout');
    body?.classList.remove('bg-img1');
    body?.classList.remove('bg-img2');
    body?.classList.remove('bg-img3');
    body?.classList.remove('bg-img4');
    switcher.updateChanges();
    switcher.checkOptions();
    html.setAttribute('dir', 'ltr');
    let styleId = document.querySelector('#style');
    styleId?.setAttribute('href','./assets/plugins/bootstrap/css/bootstrap.css');
    localStorage.removeItem('Noahorizontal')
    localStorage.removeItem('NoahorizontalHover')
    let mainContent: any = document.querySelector('.main-content');
    let mainContainer: any = document.querySelectorAll('.main-container');
    let appSidebar: any = document.querySelector('.app-sidebar');
    let header: any = document.querySelector('.header');
    let mainSidemenu: any = document.querySelector('.main-sidemenu');
    mainContent?.classList.add('app-content');
    mainContainer.forEach((e,i)=>{
      e.classList.add('container-fluid')
    })
    header?.classList.add('app-header');
    body?.classList.add('sidebar-mini');
    //remove
    body?.classList.remove('horizontal');
    body?.classList.remove('horizontal-hover');
    appSidebar?.classList.remove('horizontal-main');
    mainSidemenu?.classList.remove('container');
    mainContent?.classList.remove('hor-content');
    header?.classList.remove('hor-header');
    mainContainer.forEach((e,i)=>{
      e.classList.remove('container')
    })
    document.querySelector('.slide-left')?.classList.add('d-none');
    document.querySelector('.slide-right')?.classList.add('d-none');
    document.querySelector('.slide-leftRTL')?.classList.add('d-none');
    document.querySelector('.slide-rightRTL')?.classList.add('d-none');
  }

  public color1: string = '#8FBD56';
  public color2: string = '#8FBD56';
  public color3: string = '#8FBD56';

  public dynamicLightPrimary(data: any): void {
    this.color1 = data.color;

    const dynamicPrimaryLight = document.querySelectorAll('input.color-primary-light');

    switcher.dynamicLightPrimaryColor(dynamicPrimaryLight, this.color1);
    
    localStorage.setItem('Noalight-primary-color', this.color1);
    localStorage.setItem('Noalight-primary-hover', this.color1);
    localStorage.setItem('Noalight-primary-border', this.color1);
    let light = document.getElementById('myonoffswitch1') as HTMLInputElement;
    light.checked = true;
    localStorage.setItem('Noalight-theme', 'true')

    // Adding
    this.body?.classList.add('light-mode');

    // Removing
    this.body?.classList.remove('dark-mode');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4');
    // removing data from session storage
    localStorage.removeItem('Noadark-primary-color');
    localStorage.removeItem('Noadark-primary-hover');
    localStorage.removeItem('Noadark-primary-border');
    localStorage.removeItem('Noadark-body');    
    localStorage.removeItem('NoaBgImage');
    switcher.checkOptions();
    switcher.updateChanges();
  }
  public dynamicDarkPrimary(data: any): void {
    this.color2 = data.color;

    const dynamicPrimaryDark = document.querySelectorAll('input.color-primary-dark');

    switcher.dynamicDarkPrimaryColor(dynamicPrimaryDark, this.color2);
    
    localStorage.setItem('Noadark-primary-color', this.color2);
    localStorage.setItem('Noadark-primary-hover', this.color2);
    localStorage.setItem('Noadark-primary-border', this.color2);
    let dark = document.getElementById('myonoffswitch2') as HTMLInputElement;
    dark.checked = true;
    localStorage.setItem('Noadark-theme', 'true')
    localStorage.removeItem('Noalight-theme')

    // Adding
    this.body?.classList.add('dark-mode');
    // removing data from session storage
    localStorage.removeItem('Noalight-primary-color');
    localStorage.removeItem('Noalight-primary-hover');
    localStorage.removeItem('Noalight-primary-border');
    
    // Removing
    this.body?.classList.remove('light-mode');
    
    switcher.checkOptions();
    switcher.updateChanges();
  }
  public dynamicDarkBg(data: any): void {
    this.color3 = data.color;

    const dynamicBodyDark = document.querySelectorAll('input.dark-bg-body');

    switcher.dynamicDarkBodyColor(dynamicBodyDark, this.color3);
    
    localStorage.setItem('Noadark-body', this.color3);
    let dark = document.getElementById('myonoffswitch2') as HTMLInputElement;
    dark.checked = true;
    localStorage.setItem('Noadark-theme', 'true')
    localStorage.removeItem('Noalight-theme')

    // Adding
    this.body?.classList.add('dark-mode');
    
    // Removing
    this.body?.classList.remove('light-mode');
    let allImg = document.querySelectorAll('.bg-img');
    allImg.forEach((el, i) => {
      let ele = el.classList[0];
      this.body?.classList.remove(ele);
    });

    // removing data from session storage
    localStorage.removeItem('Noalight-primary-color');
    localStorage.removeItem('Noalight-primary-hover');
    localStorage.removeItem('Noalight-primary-border');
    localStorage.removeItem('NoaBgImage');

    switcher.checkOptions();
    switcher.updateChanges();
  }

  bgImage(e: any) {
    let transparent = document.getElementById('myonoffswitch2') as HTMLInputElement;
    transparent.checked = true;

    let img = e.parentElement.classList[0];
    localStorage.setItem('NoaBgImage', img);
    localStorage.setItem('Noadark-theme', 'true')
    localStorage.removeItem('Noalight-theme')
    // this.body?.classList.add(img);
    let allImg = document.querySelectorAll('.bg-img');
    allImg.forEach((el, i) => {
      let ele = el.classList[0];
      this.body?.classList.remove(ele);
      this.body?.classList.add(img);
    });

    // Adding
    this.body?.classList.add('dark-mode'); 

    // Removing
    this.body?.classList.remove('light-mode');
    localStorage.removeItem('Noalight-primary-color');
    localStorage.removeItem('Noalight-primary-hover');
    localStorage.removeItem('Noalight-primary-border');
    localStorage.removeItem('Noadark-body');
    
    switcher.removeForTransparent();
    switcher.updateChanges();
  }
}

