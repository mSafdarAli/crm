import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-order',
  templateUrl: './accept-order.component.html',
  styleUrls: ['./accept-order.component.scss']
})
export class AcceptOrderComponent implements OnInit {
  type: '1' | null = null;
  orders: any[] = [];
  constructor(private dialogRef: MatDialogRef<AcceptOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data,) {
    this.orders = this.data.result['data'];
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
  }
  getFileName(order){
    return order.split('|')[1];
  }
}
