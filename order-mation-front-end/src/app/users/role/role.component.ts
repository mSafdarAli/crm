import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { SiteRolesService } from 'src/_services/rest/siteRoles.service';
import { NewRoleComponent } from './new-role/new-role.component';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  form: FormGroup;
  selectRole: lookupdata[] = [];
  sitePages: any[] = [];
  checked: boolean = false;
  menuGroups: any[] = [];
  ids: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _rolesService: SiteRolesService,
    private toaster: ToastrService) {
    this.form = this.formBuilder.group({
      roleId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.getPages();
  }

  newDialog() {
    const DialogRef = this.dialog.open(NewRoleComponent, {
      width: '65%',
      minHeight: '80%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getRoles();
      sub.unsubscribe();
    });
  }

  getRoles() {
    const sub = this._rolesService.getRolesId().subscribe({
      next: res => {
        this.selectRole = res;
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  pushId(id: number) {
    if (id) {
      const index = this.ids.findIndex(e => e == id);
      if (index > -1) {
        this.ids.splice(index, 1);
      } else {
        this.ids.push(id)
      }
    }
  }

  getSitePages(event) {
    this.ids = [];
    const sub = this._rolesService.getSitePages(event).subscribe({
      next: res => {
        this.sitePages = [];
        this.sitePages = res['data'];
        this.sitePages.forEach(e => {
          e.menuGroups.forEach(el => {
            el.menuItems.forEach(x => {
              if (x.roleAllowed) {
                this.ids.push(x.id);
              }
            });
          });
        })
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  getPages() {
    const sub = this._rolesService.sitePages().subscribe({
      next: res => {
        this.sitePages = res['data'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.pages = this.ids;
      const sub = this._rolesService.createOrUpdatePages(data).subscribe({
        next: res => {
          this.toaster.success(`Updated Successfully`, 'Success');
          this.form.reset();
          this.ids = [];
          this.getPages();
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
