import { Component, OnInit } from '@angular/core';
import * as chartData from '../../../shared/data/chart/chartjs';

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss']
})
export class ChartjsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Line Chart
  public lineChartOptions = chartData.lineChartOptions
  public lineChartType = chartData.lineChartType
  public lineChartData = chartData.lineChartData


  // Bar Chart 1
  public barChartData = chartData.barChartData;
  public barChartOptions = chartData.barChartOptions;
  public barChartPlugins = chartData.barChartPlugins;
  public barChartType = chartData.barChartType;
  
  //Bar Chart 2
  public barChart2Data = chartData.barChart2Data;
  public barChart2Options = chartData.barChart2Options;
  public barChart2Type = chartData.barChart2Type;
  public barChart2Legend = chartData.barChart2Legend;
  public barChart2Plugins = chartData.barChart2Plugins;

  //Area Chart
  public AreaChartData = chartData.AreaChartData;
  public AreaChartOptions = chartData.AreaChartOptions;
  public AreaChartType = chartData.AreaChartType;
  
  //Doughnut and Pie Chart Data
  public PieChartData = chartData.PieChartData;
  public PieChartOptions = chartData.PieChartOptions;
  public PieChartType = chartData.PieChartType;
  public DoughnutChartType = chartData.DoughnutChartType;
  
  //Radar Chart
  public radarChartData = chartData.radarChartData;
  public radarChartOptions = chartData.radarChartOptions;
  public radarChartType = chartData.radarChartType;

  //Polar Chart
  public polarChartData = chartData.polarChartData;
  public polarChartOptions = chartData.polarChartOptions;
  public polarChartType = chartData.polarChartType;

}
