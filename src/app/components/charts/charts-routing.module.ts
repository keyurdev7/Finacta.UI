import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApexChartsComponent } from './apex-charts/apex-charts.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { ChartlistComponent } from './chartlist/chartlist.component';
import { EChartsComponent } from './e-charts/e-charts.component';

const routes: Routes = [
  {
    path:'', children: [
      {path: 'apex-charts', component: ApexChartsComponent},
      {path: 'chartlist', component: ChartlistComponent},
      {path: 'chartjs', component: ChartjsComponent},
      {path: 'e-charts', component: EChartsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
