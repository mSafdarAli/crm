import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/_services/auth.service';
import { MustMatch } from 'src/_services/must-match.validator';
import { UserService } from 'src/_services/rest/user.service';

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss']
})
export class ChangePasswordPopupComponent implements OnInit {
  form: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showPassword: boolean = false;
  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<ChangePasswordPopupComponent>, @Inject(MAT_DIALOG_DATA) private data,
    private dialog: MatDialog,
    private _userService: UserService,
    private toaster: ToastrService) {
    this.form = this.formBuilder.group({
      userName: [this.data.email, Validators.required],
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.maxLength(16), Validators.minLength(4)]],
      confirmPassword: [null, [Validators.required]],
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
  submit(): void {
    if (this.form.valid) {
      const sub = this._userService.changePassword(this.form.value).subscribe({
        next: res => {
          this.toaster.success('Password Updated Successfully', 'Seccuss');
          this.close();
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
