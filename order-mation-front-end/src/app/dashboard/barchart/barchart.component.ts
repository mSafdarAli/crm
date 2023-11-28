import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { barGraph, lineGraph } from 'src/_models';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {
  public chart: any;
  @Input() barGraph: any[] = [];
  labels: any[] = [];
  data: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }
  createChart() {
    this.labels = [];
    this.data = [];
    this.barGraph.forEach(el => {
      this.labels.push(el['repName']);
      this.data.push({ x: el['repName'], sale: el['totalSelling'], target: el['target'] })

    });
    this.chart = new Chart("BarChart", {
      type: 'bar', //this denotes tha type of chart
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Sale',
          data: this.data,
          hoverBackgroundColor: ['blue'],
          backgroundColor: ['#86C7F3'],
          minBarLength: 7,
          hidden: false,
          parsing: {
            yAxisKey: 'sale'
          }
        }, {
          label: 'Target',
          data: this.data,
          hoverBackgroundColor: ['red'],
          backgroundColor: ['#FFA1B5'],
          minBarLength: 7,
          hidden: false,
          parsing: {
            yAxisKey: 'target'
          }
        }]
      }
    });
  }
}
