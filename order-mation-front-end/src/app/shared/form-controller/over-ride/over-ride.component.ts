import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/_services/rest/order.service';

@Component({
  selector: 'app-over-ride',
  templateUrl: './over-ride.component.html',
  styleUrls: ['./over-ride.component.scss']
})
export class OverRideComponent implements OnInit {

  form: FormGroup;
  overrideFunction : string =null;
  overRide:boolean=false;
  constructor(private formBuilder: FormBuilder,
    private toaster : ToastrService,
    @Inject(MAT_DIALOG_DATA) private data,@Optional() private dialogRef: MatDialogRef<OverRideComponent>,private orderService : OrderService) {
    this.form = this.formBuilder.group({
      userName: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.overrideFunction = this.data.overrideFunction;
  }
  ngOnInit(): void {
  }
  close() {
		this.dialogRef.close()
	}
  onSubmit(){
    if(this.form.valid){
      const data  = Object.assign({},this.form.value);
      data.overrideFunction = this.overrideFunction;
      const subs = this.orderService.overRide(data).subscribe({
        next: (res) => {
          if(res['data']==true){
            this.overRide = true;
            this.toaster.success(
              `Override Successful`,
              'Success'
            );
          }else{
            this.overRide = false;
            this.toaster.success(
              `You do not have permissions to override`,
              'Success'
            );
          }
          
          this.dialogRef.close(this.overRide);
          subs.unsubscribe();
        },
        error: (res) => {
          subs.unsubscribe();
        },
      });
    }
    else{
      this.form.markAllAsTouched();
    }
  }
}
