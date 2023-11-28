import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuoteService } from 'src/_services/rest/quote.service';
@Component({
  selector: 'app-new-search',
  templateUrl: './new-search.component.html',
  styleUrls: ['./new-search.component.scss']
})
export class NewSearchComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private quoteService: QuoteService,
    @Optional() private dialogRef: MatDialogRef<NewSearchComponent>) {
    this.form = this.formBuilder.group({
      quoteNo: [null, Validators.required],
      orderNo: [null],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.form.valid) {
      const sub = this.quoteService.getQuoteByOrderNo({ quoteNo: this.form.value.quoteNo }).subscribe({
        next: (res) => {
          this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: res['data'].quoteId } });
          this.close();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
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
