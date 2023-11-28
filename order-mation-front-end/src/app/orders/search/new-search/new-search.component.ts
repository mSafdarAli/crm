import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderService } from 'src/_services/rest/order.service';

@Component({
  selector: 'app-new-search',
  templateUrl: './new-search.component.html',
  styleUrls: ['./new-search.component.scss']
})
export class NewSearchComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewSearchComponent>,
    private orderService: OrderService,
    private router: Router) {
    this.form = this.formBuilder.group({
      quoteNo: [null],
      orderNo: [null, [Validators.required]],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.form.valid) {
      const sub = this.orderService.getQuoteByOrderNo({ orderNo: this.form.value.orderNo }).subscribe({
        next: (res) => {
          this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: res['data'].quoteId } });
          this.close();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        }
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close()
  }
}
