import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { lineGraph } from 'src/_models';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {
  public chart: any;
  @Input() lineGraph: any[] = [];
  labels: any[] = [];
  orderData: any[] = [];
  targetData: any[] = []
  constructor() {
  }

  ngOnInit(): void {
    this.createChart();
  }
  createChart() {
    this.orderData = [];
    this.targetData= [];
    this.lineGraph.forEach(el => {
      this.labels.push(el.month + '/' + el.year);
      this.orderData.push(el['totalOrders']);
      this.targetData.push(el['target']);
      }
    )
    this.chart = new Chart("MyChart", {
    type: 'line', //this denotes tha type of chart

    data: {// values on X-Axis
      labels: this.labels,
      datasets: [
        {
          label: "Sales",
          data: this.orderData,
          borderColor: 'blue'
        },
        {
          label: "Target",
          data: this.targetData,
          borderColor: 'red'
        }
      ]
    },
    options: {
      aspectRatio: 2.5
    }

  });
  }
}
