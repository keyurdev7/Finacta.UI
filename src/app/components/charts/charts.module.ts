import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import { EChartsComponent } from './e-charts/e-charts.component';
import { ChartlistComponent } from './chartlist/chartlist.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { ApexChartsComponent } from './apex-charts/apex-charts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgApexchartsModule } from 'ng-apexcharts'
import { NgxEchartsModule } from 'ngx-echarts';
import { NgChartsModule } from 'ng2-charts';
import { ChartistModule } from "ng-chartist";
@NgModule({
  declarations: [
    EChartsComponent,
    ChartlistComponent,
    ChartjsComponent,
    ApexChartsComponent
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    SharedModule,
    NgApexchartsModule, 
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgChartsModule,
    ChartistModule
  ]
})
export class ChartsModule { }
