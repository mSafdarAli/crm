import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { SettingService } from 'src/_services/rest/setting.service';
import { SortService } from 'src/_services/sort.service';
import { NewSettingComponent } from './new-setting/new-setting.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  selectsettings: lookupdata[] = [];
  data: any[] = [];
  search: FormGroup;
  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewSettingComponent>,
    private dialog: MatDialog,
    private settingService: SettingService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.selectsettings = this.settingService.getSettings();
    this.form = this.formBuilder.group({
      setting: [null, Validators.required]
    });
    this.search = this.formBuilder.group({
      search: ['']
    })
  }

  ngOnInit(): void {
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewSettingComponent, {
      data: { url: this.form.value.setting, id: id },
      width: '60%',
      minHeight: '80%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.selectedSetting(this.form.value.setting);
      sub.unsubscribe();
    });
  }
  searchActionTypes( params) {
    this.data = [];
    this.selectedSetting(this.form.value.setting, params);
  }
  selectedSetting(url: string, params = null) {
    if (['jobtype', 'obtainedfrom', "paymentterms"].indexOf(url) > -1) {
      url = "referenceCodes/getByType/" + url;
    }
    const sub = this.settingService.getSettingGrid(url,params).subscribe({
      next: (res) => {
        this.data = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  deleteSetting(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.settingService.deletesetting(id, this.form.value.setting);
        })
      )
      .subscribe({
        next: (res) => {
          this.selectedSetting(this.form.value.setting);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(sort, [
      "code",
      "description",          
      ], this.data);
  }
}
