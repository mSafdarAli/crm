import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderService } from 'src/_services/rest/order.service';

@Component({
  selector: 'app-new-repeat',
  templateUrl: './new-repeat.component.html',
  styleUrls: ['./new-repeat.component.scss']
})
export class NewRepeatComponent implements OnInit {
 
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewRepeatComponent>,
    private router : Router,
    private orderService : OrderService
    ) {
    this.form = this.formBuilder.group({
      quoteNo: [null , Validators.required],
      orderNo: [null],
    });
  }
  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }
  onSubmit() {
    if(this.form.valid){
    const sub = this.orderService.getQuoteByOrderNo({quoteNo : this.form.value.quoteNo}).subscribe({
      next: res => {
        this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: res['data'].quoteId , repeatQuote : true}});
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
