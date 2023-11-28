import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { WeightsService } from 'src/_services/rest/weights.service';

@Component({
  selector: 'app-weight-popup',
  templateUrl: './weight-popup.component.html',
  styleUrls: ['./weight-popup.component.scss']
})
export class WeightPopupComponent implements OnInit {
  form : FormGroup;
  WeightID: string = null;
  selectsettings: lookupdata [] = [];
  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<WeightPopupComponent>,
  private messageService: MessageService,
    private toaster: ToastrService,
    private weightsService: WeightsService,
    @Inject(MAT_DIALOG_DATA) private data) {   
      this.WeightID = this.data.id;     
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      code: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active:[true, Validators.required]
    });

    if (this.WeightID) {
      const sub = this.weightsService.getSingleWeights(this.WeightID).subscribe({
        next: (res) => {          
          this.form.patchValue({            
            code: res['data'].code ? res['data'].code : '',           
            description: res['data'].description ? res['data'].description : '',            
            active: res['data'].active ? res['data'].active : false,            
          });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }


  close() {
		this.dialogRef.close()
	}


  onSubmit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.WeightID) {
      data.id = this.WeightID;
      }
      const sub = this.weightsService
        .createOrUpdateWeights(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Weights ${this.WeightID ? 'Updated' : 'Created'} Successfully`,
              'Success'
            );
            this.dialogRef.close();
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
}
