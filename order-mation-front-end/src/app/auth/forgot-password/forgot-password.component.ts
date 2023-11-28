import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private _auth: AuthService, private router: Router , private toaster : ToastrService) {
    this.form = this.formBuilder.group({
      userName: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }
  submit() {
    if (this.form.valid) {
      const sub = this._auth.forgotPassword(this.form.value.userName).subscribe({
        next: res => {
          this.toaster.success('Check your Email', 'Email Sent Successfull');
          this.router.navigateByUrl['/login'];
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });

    }
  }
}
