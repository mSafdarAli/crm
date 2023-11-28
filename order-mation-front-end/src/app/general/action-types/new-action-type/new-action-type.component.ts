import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { ActionTypeService } from 'src/_services/rest/actionType.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-new-action-type',
  templateUrl: './new-action-type.component.html',
  styleUrls: ['./new-action-type.component.scss']
})
export class NewActionTypeComponent implements OnInit {
  form: FormGroup;
  actionListTypeId: number = 0;
  actionID: string = null;
  selectcategory: lookupdata[] = [];
  selectsortorder: lookupdata[] = [];
  selectDependancy: lookupdata[] = [];
  selectselectrole: lookupdata[] = [];
  selectdepartment: lookupdata[] = [];
  selectmailtemplate: lookupdata[] = [];
  selectMustaction: lookupdata[] = [];
  selectType: lookupdata[] = [];
  templates: any[] = [];
  selectedTemplates: any[] = [];
  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) private data, private toaster: ToastrService, @Optional() private dialogRef: MatDialogRef<NewActionTypeComponent>, private actionService: ActionTypeService, private lookupService: LookUpService, private messageService: MessageService) {
    this.actionID = this.data.id;
    this.selectsortorder = this.lookupService.sortOrder();
    const sub = this.lookupService.getTypes().subscribe({
      next: res => {
        this.selectType = res;
        sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    });
    this.form = this.formBuilder.group({
      actionListTypeId: [null, [Validators.required]],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.required, Validators.maxLength(128)]],
      categoryId: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.maxLength(50)]],
      attachDocs: [false],
      isAttachmentMandatory: [false],
      userList: [false],
      dateField: [false],
      signBox: [false],
      extraField: [false],
      extraFieldDescription: [null],
      extraDescription: [false],
      sortorder: [null, [Validators.required]],
      sendEmail: [false],
      sendToCustomer: [false],
      sendToSupplier: [false],
      sendToRep: [false],
      sendToUser: [false],
      attachOrder: [false],
      sendAttachments: [false],
      notificationTemplateId: [null],
      actionId: [null],
      roleId: [null],
      isDependent: [false],
      dependency: [null],
      lineItemAction: [false],
      active: [true],
      uploadFile: [null],
    });
    this.getCategories();
    this.getmailTemplate();
    this.getActionTypes();
    this.getRoles();
  }

  ngOnInit(): void {
    if (this.actionID) {
      const sub = this.actionService.getSingleActionType(this.actionID).subscribe({
        next: (res) => {
          this.getactionTypeList(res['data'].id, res['data'].actionListTypeId);
          this.getDependency(res['data'].actionListTypeId, res['data'].id);
          this.getTemplates(res['data'].id);
          this.actionListTypeId = res['data'].actionListTypeId;
          this.form.patchValue({
            actionListTypeId: res['data'].actionListTypeId ? res['data'].actionListTypeId : '',
            code: res['data'].code ? res['data'].code : '',
            description: res['data'].description ? res['data'].description : '',
            categoryId: res['data'].categoryId ? res['data'].categoryId : '',
            status: res['data'].status ? res['data'].status : '',
            attachDocs: res['data'].attachDocs ? res['data'].attachDocs : false,
            isAttachmentMandatory: res['data'].isAttachmentMandatory ? res['data'].isAttachmentMandatory : false,
            userList: res['data'].userList ? res['data'].userList : false,
            dateField: res['data'].dateField ? res['data'].dateField : false,
            signBox: res['data'].signBox ? res['data'].signBox : false,
            extraField: res['data'].extraField ? res['data'].extraField : false,
            extraFieldDescription: res['data'].extraFieldDescription ? res['data'].extraFieldDescription : '',
            extraDescription: res['data'].extraDescription ? res['data'].extraDescription : false,
            sortorder: res['data'].sortOrder ? res['data'].sortOrder : '',
            sendEmail: res['data'].sendEmail ? res['data'].sendEmail : false,
            sendToCustomer: res['data'].sendToCustomer ? res['data'].sendToCustomer : false,
            sendToSupplier: res['data'].sendToSupplier ? res['data'].sendToSupplier : false,
            sendToRep: res['data'].sendToRep ? res['data'].sendToRep : false,
            sendToUser: res['data'].sendToUser ? res['data'].sendToUser : false,
            attachOrder: res['data'].attachOrder ? res['data'].attachOrder : false,
            sendAttachments: res['data'].sendAttachments ? res['data'].sendAttachments : false,
            notificationTemplateId: res['data'].notificationTemplateId ? res['data'].notificationTemplateId : '',
            actionId: res['data'].actionId ? res['data'].actionId : '',
            roleId: res['data'].roleId ? res['data'].roleId : '',
            isDependent: res['data'].isDependent ? res['data'].isDependent : false,
            lineItemAction: res['data'].lineItemAction ? res['data'].lineItemAction : false,
            active: res['data'].active ? res['data'].active : false
          })
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

  getDependency(actionListTypeId, actionID) {
    const sub = this.actionService.getDependency({ actionTypeId: actionID, actionListTypeId: actionListTypeId }).subscribe({
      next: (res) => {
        const dependents: any[] = [];
        res.forEach(el => {
          if (el.isDependent) {
            dependents.push(el.id);
          }
        });
        this.form.patchValue({
          dependency: dependents
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getTemplates(id) {
    const sub = this.actionService.getTemplates(id).subscribe({
      next: (res) => {
        this.selectedTemplates = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getactionTypeList(actionTypeId, actionTypeListId) {
    const sub = this.actionService.getActionTypeList({ actionTypeId: actionTypeId, actionListTypeId: actionTypeListId }).subscribe({
      next: (res) => {
        this.selectDependancy = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getCategories() {
    const sub = this.lookupService.getCategories().subscribe({
      next: (res) => {
        this.selectcategory = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getmailTemplate() {
    const sub = this.lookupService.getmailTemplate().subscribe({
      next: (res) => {
        this.selectmailtemplate = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getActionTypes() {
    const sub = this.actionService.getActionTypes().subscribe({
      next: (res) => {
        this.selectMustaction = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getRoles() {
    const sub = this.lookupService.getRolesId().subscribe({
      next: (res) => {
        this.selectselectrole = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.actionID) {
        data.id = this.actionID;
      }
      const sub = this.actionService.createOrUpdateActionType(data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Action Type ${this.actionID ? 'Updated' : 'Created'} Successfully`,
            'Success'
          );
          this.dialogRef.close();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
      if (this.form.value.isDependent) {
        const dependency = this.form.value.dependency
        const depencyData = {};
        if (this.actionID) {
          depencyData['actionTypeId'] = this.actionID;
          depencyData['dependencies'] = dependency;
        }
        const sub = this.actionService.createDependencies(depencyData).subscribe({
          next: (res) => {
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      if (this.templates.length > 0) {
        const sub = this.actionService.createTemplate(this.actionID, this.templates).subscribe({
          next: (res) => {
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  radioChange(event) {
    this.form.patchValue({
      userList: (event.value == 'userList') ? true : false,
      dateField: (event.value == 'dateField') ? true : false,
      signBox: (event.value == 'signBox') ? true : false,
      extraField: (event.value == 'extraField') ? true : false,
    })
  }

  uploadTemplate(event) {
    const file = event.target.files[0];
    this.templates.push(file);
  }

  removeFile(file) {
    const ind = this.templates.indexOf(file);
    this.templates.splice(ind, 1);
  }

  viewTemplate(blob) {
    FileSaver.saveAs(blob);
  }

  removeTemplate(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this Template?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.actionService.deleteTemplate(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getTemplates(this.actionID);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

}
