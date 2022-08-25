import { Component, OnInit } from '@angular/core';
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private gallery: Gallery) {}

  images:any[]=[
    { path: './assets/images/media/1.jpg' },
    { path: './assets/images/media/4.jpg' },
    { path: './assets/images/media/5.jpg' },
    { path: './assets/images/media/6.jpg' },
    { path: './assets/images/media/7.jpg' },
    { path: './assets/images/media/8.jpg' },
    { path: './assets/images/media/11.jpg' },
    { path: './assets/images/media/10.jpg' },
    { path: './assets/images/media/2.jpg' },
    { path: './assets/images/media/9.jpg' },
    { path: './assets/images/media/12.jpg' },
    { path: './assets/images/media/20.jpg' },
  ]
  showGallery(index: number) {
    let prop: any = {};
    prop.images =  this.images;
    prop.index = index;
    this.gallery.load(prop);
  }
  ngOnInit(): void {}
  closeGallery() {
    this.gallery.close();
  }
}
