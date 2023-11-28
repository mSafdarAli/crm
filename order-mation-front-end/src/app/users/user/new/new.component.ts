import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { lookupdata } from 'src/_models/lookup';
import { AuthService } from 'src/_services/auth.service';
import { MessageService } from 'src/_services/message.service';
import { MustMatch } from 'src/_services/must-match.validator';
import { SiteRolesService } from 'src/_services/rest/siteRoles.service';
import { UserService } from 'src/_services/rest/user.service';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  form: FormGroup;
  selectRole: lookupdata[] = [];
  linkedcontact: FormGroup;
  linkedContacts: [] = [];
  user: any;
  rowId: string = null;
  linkContactId: number = null;

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    private toaster: ToastrService,
    private _userService: UserService,
    private messageService: MessageService,
    private authService: AuthService,
    private _sitRoleService: SiteRolesService, @Inject(MAT_DIALOG_DATA) private data) {
    if (this.data.id) {
      this.rowId = this.data.id;
    }
    this.getRoles();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.maxLength(32)]],
      lastName: [null, [Validators.required, Validators.maxLength(32)]],
      userName: [null, [Validators.required, Validators.maxLength(16)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      emailAddress: [null, [Validators.required, Validators.maxLength(64)]],
      telephoneNumber: [null, [Validators.maxLength(50)]],
      contactNumber: [null, [Validators.maxLength(50)]],
      code: [null, [Validators.maxLength(50)]],
      title: [null, [Validators.maxLength(100)]],
      pastelUserId: [null],
      role: [null],
      active: [true]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.linkedcontact = this.formBuilder.group({
      email: [null, [Validators.required, Validators.maxLength(500)]],
      contactNo: [null, [Validators.required, Validators.maxLength(50)]],
      name: [null, [Validators.required, Validators.maxLength(500)]],
    });
    if (this.rowId) {
      this.form.controls['password'].clearValidators();
      this.form.controls['confirmPassword'].clearValidators();
      const sub = this._userService.getUser(this.rowId).subscribe({
        next: res => {
          let roles: lookupdata[] = [];
          res['data'].userRoles.forEach(el => {
            roles.push(el.roleId)
          });
          this.form.patchValue({
            firstName: res['data'].firstName,
            lastName: res['data'].lastName,
            userName: res['data'].userName,
            emailAddress: res['data'].emailAddress,
            telephoneNumber: res['data'].telephoneNumber,
            contactNumber: res['data'].contactNumber,
            code: res['data'].code,
            title: res['data'].title,
            pastelUserId: res['data'].pastelUserId,
            role: roles,
            active: res['data'].active
          })
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
    if (this.rowId) {
      this.getLinkedContacts(this.rowId);
    }
  }

  getRoles() {
    const sub = this._sitRoleService.getRoles().subscribe({
      next: res => {
        this.selectRole = res;
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const roles: any[] = [];
      if (this.form.value.role.length > 0) {
        this.form.value.role.forEach(el => {
          roles.push({
            RoleId: el
          })
        });
      }
      const data = Object.assign({}, this.form.value);
      if (this.rowId) {
        data.id = this.rowId;
      }
      data.clientId = this.authService.userDetails.ClientId;
      data.roles = roles;
      delete data.role;
      const sub = this._userService.createOrUpdateUser(data).subscribe({
        next: res => {
          this.dialogRef.close();
          this.toaster.success(`User ${(this.rowId) ? "Updated" : "Created"} Successfully`, 'Success');
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    } else {
      this.form.markAllAsTouched()
    }
  }

  lowerform() {
    if (this.linkedcontact.valid) {
      const data = Object.assign({}, this.linkedcontact.value);
      data.userId = this.rowId
      if (this.linkContactId != null) {
        data.id = this.linkContactId
      }
      const subLinked = this._userService.createOrUpdateLinkedContact(data).subscribe({
        next: res => {
          this.getLinkedContacts(this.rowId)
          this.linkedcontact.reset();
          this.toaster.success(`Contact ${(this.linkContactId) ? "Updated" : "Created"} Successfully`, 'Success');
          subLinked.unsubscribe();
          this.linkContactId = null;
        }, error: res => {
          subLinked.unsubscribe();
        }
      });
    }
  }

  close() {
    this.dialogRef.close()
  }

  getLinkedContacts(id: string) {
    const sub = this._userService.getLinkedContacts(id).subscribe({
      next: res => {
        this.linkedContacts = res['data'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  deleteLinkedUser(id: number) {
    const isub = this.messageService
      .prompt(
        `Are you sure you want to delete this record?`,
      )
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this._userService.deleteLinkedUser(id);
        }),
      ).subscribe({
        next: res => {
          this.getLinkedContacts(this.rowId);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        }, error: res => {
          isub.unsubscribe();
        }
      });
  }

  editLinkedUser(id: number) {
    if (id) {
      this.linkContactId = id;
      const sub = this._userService.getSingleLinkedContacts(id).subscribe({
        next: res => {
          this.linkedcontact.patchValue({
            email: (res['data'].email) ? res['data'].email : '',
            contactNo: (res['data'].contactNo) ? res['data'].contactNo : '',
            name: (res['data'].name) ? res['data'].name : '',
          })
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
  }
}