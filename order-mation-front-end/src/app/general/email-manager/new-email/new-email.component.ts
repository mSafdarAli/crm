import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Editor, toHTML, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { EmailManagerService } from 'src/_services/rest/emailManager.service';
@Component({
  selector: 'app-new-email',
  templateUrl: './new-email.component.html',
  styleUrls: ['./new-email.component.scss'],
})
export class NewEmailComponent implements OnInit, OnDestroy {
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  form: FormGroup;
  notifications: [] = [];
  EmailManagerID: string = null;

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewEmailComponent>,
    private emailManagerService: EmailManagerService,
    @Inject(MAT_DIALOG_DATA) private data,
    private toaster: ToastrService) {
    this.EmailManagerID = this.data.id;

    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(32)]],
      subject: [null, [Validators.required, Validators.maxLength(150)]],
      sendTo: [null, [Validators.maxLength(500)]],
      description: ['', [Validators.maxLength(500)]],
      previewFirst: [false],
      sendtorep: [false],
      sendtolinkedcontacts: [false],
      active: [true],
      templateHTML: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
    if (this.EmailManagerID) {
      const sub = this.emailManagerService
        .getSingleEmailNotification(this.EmailManagerID)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              name: res['data'].name ? res['data'].name : '',
              subject: res['data'].subject ? res['data'].subject : '',
              sendTo: res['data'].sendTo ? res['data'].sendTo : '',
              description: res['data'].description ? res['data'].description : '',
              previewFirst: res['data'].previewFirst ? res['data'].previewFirst : false,
              sendtorep: res['data'].sendToRep ? res['data'].sendToRep : false,
              sendtolinkedcontacts: res['data'].sendToLinkedContacts ? res['data'].sendToLinkedContacts : false,
              active: res['data'].active ? res['data'].active : false,
              templateHTML: res['data'].templateHTML ? res['data'].templateHTML : '',
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
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      const html = (typeof this.form.value.templateHTML == "object") ? toHTML(this.form.value.templateHTML) : this.form.value.templateHTML;
      const data = Object.assign({}, this.form.value);
      data.templateHTML = html;
      if (this.EmailManagerID) {
        data.id = this.EmailManagerID;
      }
      const sub = this.emailManagerService
        .createOrUpdateNotification(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Email Manager ${this.EmailManagerID ? 'Updated' : 'Created'
              } Successfully`,
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
