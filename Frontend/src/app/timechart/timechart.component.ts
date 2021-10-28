import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {PositionService} from "../_services/position.service";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-timechart',
  templateUrl: './timechart.component.html',
  styleUrls: ['./timechart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimechartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  time = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  public chartOptions: Partial<ChartOptions>;
  startTime ="00:00";
  endTime ="23:59";
  total = 0;
  subscription: Subscription;
  times = [];
  constructor(private positionService: PositionService) {
    this.chartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "bubble",
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: true
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    fill: {
      opacity: 0.8
    },
    title: {
      text: "Time Density"
    },
    xaxis: {
      tickAmount: 20,
      type: "datetime"
    },
    yaxis: {
      tickAmount: 2,
      max: 1,
      labels: {
        show: false
      }
    }
    }
  }

  ngOnInit(): void {
  this.subscription = this.positionService.currentTimeSubject.subscribe(positions => this.addValues(positions));
}
  public addValues(positions):void {
    this.total = 0;
    this.chartOptions.series = [];
    this.resetValues();
    positions.forEach(p =>{
      this.total = this.total + 1;
      const ts = p.timestamp;
      const uid:string = p.userId;
      console.log("got time" + new Date(ts*1000) +" from uid_ "+uid);
      if(! this.times[uid]){
        this.times[uid] = [];
      }
      this.times[uid].push([new Date(ts*1000),0.5, 10]);
     // this.chartOptions.series.push({name: uid, data: [ts,2, 40] });
    });
    Object.keys(this.times).forEach(uid => {
      this.chartOptions.series.push({name: uid, data: this.times[uid] });
    });
    this.chartOptions.tooltip.enabled = false;
    console.log(this.chartOptions);
  }
  public resetValues(): void{
    Object.keys(this.times).forEach(uid => {
    this.times[uid] = [];
    });
  }
  onTimeChange():void{
    let start = 0;
    let end = 0;
    if (this.range.get('start').value !== null && this.range.get('end').value !== null ) {
        start =  this.range.get('start').value.getTime(); // get selected date
        start = start + this.toTimestamp(this.startTime); // add selected time
        end =  this.range.get('end').value.getTime();
        end = end + this.toTimestamp(this.endTime);
      this.positionService.changeDateRange(start, end);
    }
    }
    toTimestamp(val): number{
      let a = val.split(':');
      //convert in milliseconds
      return (a[0]*60*60 + a[1]*60)*1000;
    }
  selectDateRange(): void{
    if (this.range.get('start').value !== null && this.range.get('end').value !== null ){
      this.positionService.changeDateRange(this.range.get('start').value.getTime(), this.range.get('end').value.getTime());
    }
  }

}


