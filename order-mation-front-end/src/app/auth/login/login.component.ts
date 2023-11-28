import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  returnUrl: string;
  showPassword: boolean = false
  constructor(private formBuilder: FormBuilder, private _auth: AuthService, private router: Router, private route: ActivatedRoute, private toaster: ToastrService) {
    this.form = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.maxLength(16), Validators.minLength(4),]]
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['returnUrl']) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'].replace(/->/g, '/');
    }
  }
  submit(): void {
    if (this.form.valid) {
      const sub = this._auth.login(this.form.value.userName, this.form.value.password).subscribe({
        next: res => {
          this.toaster.success('You\’ve Logged In Successfully', 'Login Successfull');
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/dashboard');
          }
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
