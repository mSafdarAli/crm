import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderService } from 'src/_services/rest/order.service';

@Component({
  selector: 'app-repeat-order',
  templateUrl: './repeat-order.component.html',
  styleUrls: ['./repeat-order.component.scss']
})
export class RepeatOrderComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<RepeatOrderComponent>,
    private router : Router,
    private orderService : OrderService
    ) {
    this.form = this.formBuilder.group({
      quoteNo: [null],
      orderNo: [null, Validators.required],
    });
  }
  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }
  onsubmit() {
    if(this.form.valid){
    const sub = this.orderService.getQuoteByOrderNo({orderNo : this.form.value.orderNo}).subscribe({
      next: res => {
        this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: res['data'].quoteId, repeatOrder: true, title: "Repeat Order" }});
        this.close();
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }
  else{
    this.form.markAllAsTouched();
  }
}

}
