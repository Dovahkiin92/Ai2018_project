import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";
import {Subscription} from "rxjs";
import {PositionService} from "../_services/position.service";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-timechart',
  templateUrl: './timechart.component.html',
  styleUrls: ['./timechart.component.css']
})
export class TimechartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  total = 0;
  subscription: Subscription;
  times = [];
  constructor(private positionService: PositionService) {  this.chartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "bubble"
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 0.8
    },
    title: {
      text: "Time Chart"
    },
    xaxis: {
      tickAmount: 20,
      type: "category"
    },
    yaxis: {
      tickAmount: 2,
      max: 1
    }
  };
  }
  ngOnInit(): void {
    this.subscription = this.positionService.currentTimeSubject.subscribe(positions => this.addValues(positions));
  }
  public addValues(positions):void {
    this.total = 0;
    positions.forEach(p =>{
      this.total = this.total + 1;
      const ts = p.timestamp;
      const uid:string = p.userId;
      console.log("got time" + ts +" from uid_ "+uid);
      if(! this.times[uid]){
        this.times[uid] = [];
      }
      this.times[uid].push([ts,0.5,10]);
     // this.chartOptions.series.push({name: uid, data: [ts,2, 40] });
    });
    Object.keys(this.times).forEach(uid => {
      this.chartOptions.series.push({name: uid, data: this.times[uid] });
    });
    console.log(this.chartOptions);
  }
  public generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}


