import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SiteRolesService } from 'src/_services/rest/siteRoles.service';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {
form : FormGroup;
  constructor(private formBuilder : FormBuilder ,@Optional() private dialogRef: MatDialogRef<NewRoleComponent>,private toaster: ToastrService, private _rolesService: SiteRolesService) {
    this.form = this.formBuilder.group({
      name : [null , Validators.required]
    });
   }

  ngOnInit(): void {
  }
  submit(){
    if(this.form.valid){
      const sub = this._rolesService.createOrUpdateRoles(this.form.value).subscribe({
        next: res => {
          this.toaster.success(`Role Created Successfully`, 'Success');
          this.dialogRef.close();
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
  }
  close() {
		this.dialogRef.close();
	}
}
