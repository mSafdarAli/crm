import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { SupplierService } from 'src/_services/rest/supplier.service';
@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss'],
})
export class NewSupplierComponent implements OnInit {
  form: FormGroup;
  suppliersID: string = null;
  addressform: FormGroup;
  contactform: FormGroup;
  selectsupplier: lookupdata[] = [];
  selectaccount: lookupdata[] = [];
  selectrep: lookupdata[] = [];
  selectregion: lookupdata[] = [];
  selectpaymentterms: lookupdata[] = [];
  selectstatuscode: lookupdata[] = [];
  contactId: number = null;
  linkedContacts: [] = [];
  supplierContacts: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewSupplierComponent>,
    private supplierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) private data,
    private lookupService: LookUpService,
    private toaster: ToastrService,
    private messageService: MessageService) {
    this.getAccountTypes();
    this.getPaymentTerms();
    this.getSingleSupplierType();
    this.suppliersID = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [null],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      supplierTypeId: [null],
      accountTypeId: [null],
      vatNo: [null, [Validators.maxLength(32)]],
      vatAmount: [null, Validators.required],
      telNo1: [null, [Validators.maxLength(16)]],
      telNo2: [null, [Validators.maxLength(16)]],
      faxNo: [null, [Validators.maxLength(16)]],
      paymentTermsId: [null],
      website: [null, [Validators.maxLength(500)]],
      physicalAddress1: [null, [Validators.maxLength(64)]],
      physicalAddress2: [null, [Validators.maxLength(64)]],
      physicalAddress3: [null, [Validators.maxLength(64)]],
      physicalCode: [null, [Validators.maxLength(16)]],
      postalAddress1: [null, [Validators.maxLength(64)]],
      postalAddress2: [null, [Validators.maxLength(64)]],
      postalAddress3: [null, [Validators.maxLength(64)]],
      postalCode: [null, [Validators.maxLength(16)]],
      active: [true],
      sendPurchaseOrder: [false],
      emailAddress: [null]
    });

    this.contactform = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(500)]],
      email: [null, [Validators.required, Validators.maxLength(500)]],
      contactNo: [null, [Validators.required, Validators.maxLength(50)]],
    });

    if (this.suppliersID) {
      const sub = this.supplierService
        .getSingleSupplier(this.suppliersID)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              code: res['data'].code ? res['data'].code : '',
              description: res['data'].description ? res['data'].description : '',
              supplierTypeId: res['data'].supplierTypeId ? res['data'].supplierTypeId : '',
              accountTypeId: res['data'].accountTypeId ? res['data'].accountTypeId : '',
              vatNo: res['data'].vatNo ? res['data'].vatNo : '',
              vatAmount: res['data'].vatAmount ? res['data'].vatAmount : '',
              telNo1: res['data'].telNo1 ? res['data'].telNo1 : '',
              telNo2: res['data'].telNo2 ? res['data'].telNo2 : '',
              faxNo: res['data'].faxNo ? res['data'].faxNo : '',
              paymentTermsId: res['data'].paymentTermsId ? res['data'].paymentTermsId : '',
              website: res['data'].website ? res['data'].website : '',
              physicalAddress1: res['data'].physicalAddress1 ? res['data'].physicalAddress1 : '',
              physicalAddress2: res['data'].physicalAddress2 ? res['data'].physicalAddress2 : '',
              physicalAddress3: res['data'].physicalAddress3 ? res['data'].physicalAddress3 : '',
              postalAddress1: res['data'].postalAddress1 ? res['data'].postalAddress1 : '',
              postalAddress2: res['data'].postalAddress2 ? res['data'].postalAddress2 : '',
              postalAddress3: res['data'].postalAddress3 ? res['data'].postalAddress3 : '',
              physicalCode: res['data'].physicalCode ? res['data'].physicalCode : '',
              postalCode: res['data'].postalCode ? res['data'].postalCode : '',
              emailAddress: res['data'].emailAddress ? res['data'].emailAddress : '',
              active: res['data'].active ? res['data'].active : false,
              sendPurchaseOrder: res['data'].sendPurchaseOrder ? res['data'].sendPurchaseOrder : false,
            });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    }
    if (this.suppliersID) {
      this.getAllSupplierContacts(this.suppliersID);
    }
  }

  close() {
    this.dialogRef.close();
  }

  getAllSupplierContacts(id: string) {
    const sub = this.supplierService.getAllSupplierContacts(id).subscribe({
      next: (res) => {
        this.supplierContacts = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getsingleContact(id) {
    this.contactId = id;
    const sub = this.supplierService.getsingleSupplierContact(id).subscribe({
      next: (res) => {
        this.contactform.patchValue({
          email: res['data'].email ? res['data'].email : '',
          name: res['data'].name ? res['data'].name : '',
          contactNo: res['data'].contactNo ? res['data'].contactNo : '',
        });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getAccountTypes() {
    const sub = this.lookupService.getAccountTypes().subscribe({
      next: (res) => {
        this.selectaccount = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getSingleSupplierType() {
    const sub = this.supplierService.getSingleSupplierType().subscribe({
      next: (res) => {
        this.selectsupplier = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getPaymentTerms() {
    const sub = this.lookupService.getPaymentTerms().subscribe({
      next: (res) => {
        this.selectpaymentterms = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  contactSave() {
    if (this.contactform.valid) {
      const data = Object.assign({}, this.contactform.value);
      data.supplierId = this.suppliersID;
      data.id = this.contactId;
      const sub = this.supplierService.createOrUpdateSupplierContacts(data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Supplier Contact ${this.contactId ? 'Updated' : 'Created'} Successfully`,
            'Success'
          );
          this.getAllSupplierContacts(this.suppliersID);
          this.contactform.reset();
          this.contactId = null;
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.suppliersID) {
        data.id = this.suppliersID;
      }
      const sub = this.supplierService.createOrUpdateSupplier(data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Supplier ${this.suppliersID ? 'Updated' : 'Created'} Successfully`,
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

  deleteContact(id: number) {
    const isub = this.messageService
      .prompt(
        `Are you sure you want to delete this record?`,
      )
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.supplierService.deleteContact(id);
        }),
      ).subscribe({
        next: res => {
          this.getAllSupplierContacts(this.suppliersID);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        }, error: res => {
          isub.unsubscribe();
        }
      });

  }
}
