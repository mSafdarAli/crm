import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { CustomerService } from 'src/_services/rest/customer.service';
import { LookUpService } from 'src/_services/rest/lookup.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss'],
})
export class NewCustomerComponent implements OnInit {
  customersID: string = null;
  form: FormGroup;
  addressform: FormGroup;
  contactform: FormGroup;
  selectcategory: lookupdata[] = [];
  selectaccount: lookupdata[] = [];
  selectrep: lookupdata[] = [];
  selectregion: lookupdata[] = [];
  selectpaymentterms: lookupdata[] = [];
  selectstatuscode: lookupdata[] = [];
  customerContacts: [] = [];
  contactId: number = null;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewCustomerComponent>,
    private customerService: CustomerService,
    private toaster: ToastrService,
    private lookupService: LookUpService,
    @Inject(MAT_DIALOG_DATA) private data,
    private messageService: MessageService) {
    this.customersID = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [null],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      tradingAs: [null],
      customerCategoryId: [null],
      accountTypeId: [null],
      repId: [null],
      provinceId: [null],
      vatno: [null, [Validators.maxLength(32)]],
      vatAmount: [null, Validators.required],
      companyRegNo: [null],
      telNo2: [null, [Validators.maxLength(64)]],
      paymentTermsId: [null],
      statusCodeId: [null],
      telNo1: [null, [Validators.maxLength(16)]],
      faxno: [null, [Validators.maxLength(16)]],
      postalAddress1: [null, [Validators.maxLength(64)]],
      postalAddress2: [null, [Validators.maxLength(64)]],
      postalAddress3: [null, [Validators.maxLength(64)]],
      physicalAddress1: [null, [Validators.maxLength(64)]],
      physicalAddress2: [null, [Validators.maxLength(64)]],
      physicalAddress3: [null, [Validators.maxLength(64)]],
      deliveryAddress1: [null, [Validators.maxLength(64)]],
      deliveryAddress2: [null, [Validators.maxLength(64)]],
      deliveryAddress3: [null, [Validators.maxLength(64)]],
      deliveryAddress4: [null, [Validators.maxLength(64)]],
      postalCode: [null, [Validators.maxLength(16)]],
      physicalCode: [null, [Validators.maxLength(16)]],
      active: [true],
      sameAs: [false],
      website: [null, [Validators.maxLength(500)]],
    });
    this.contactform = this.formBuilder.group({
      name: [null, [Validators.maxLength(500)]],
      email: [null, [Validators.maxLength(500)]],
      contactNo: [null, [Validators.maxLength(500)]],
      isDefault: [false],
    });
    this.getCustomerCategories();
    this.getAccountTypes();
    this.getRegion();
    this.getPaymentTerms();
    this.getStatus();
    this.getRep();

    if (this.customersID) {
      const sub = this.customerService
        .getSingleCustomer(this.customersID)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              code: res['data'].code ? res['data'].code : '',
              description: res['data'].description ? res['data'].description : '',
              tradingAs: res['data'].tradingAs ? res['data'].tradingAs : '',
              customerCategoryId: res['data'].customerCategoryId ? res['data'].customerCategoryId : '',
              accountTypeId: res['data'].accountTypeId ? res['data'].accountTypeId : '',
              repId: res['data'].repId ? res['data'].repId : '',
              provinceId: res['data'].provinceId ? res['data'].provinceId : '',
              vatno: res['data'].vatNo ? res['data'].vatNo : '',
              vatAmount: res['data'].vatAmount ? res['data'].vatAmount : '',
              companyRegNo: res['data'].companyRegNo ? res['data'].companyRegNo : '',
              telNo2: res['data'].telNo2 ? res['data'].telNo2 : '',
              paymentTermsId: res['data'].paymentTermsId ? res['data'].paymentTermsId : '',
              statusCodeId: res['data'].statusCodeId ? res['data'].statusCodeId : '',
              telNo1: res['data'].telNo1 ? res['data'].telNo1 : '',
              faxno: res['data'].faxNo ? res['data'].faxNo : '',
              postalAddress1: res['data'].postalAddress1 ? res['data'].postalAddress1 : '',
              postalAddress2: res['data'].postalAddress2 ? res['data'].postalAddress2 : '',
              postalAddress3: res['data'].postalAddress3 ? res['data'].postalAddress3 : '',
              physicalAddress1: res['data'].physicalAddress1 ? res['data'].physicalAddress1 : '',
              physicalAddress2: res['data'].physicalAddress2 ? res['data'].physicalAddress2 : '',
              physicalAddress3: res['data'].physicalAddress3 ? res['data'].physicalAddress3 : '',
              deliveryAddress1: res['data'].deliveryAddress1 ? res['data'].deliveryAddress1 : '',
              deliveryAddress2: res['data'].deliveryAddress2 ? res['data'].deliveryAddress2 : '',
              deliveryAddress3: res['data'].deliveryAddress3 ? res['data'].deliveryAddress3 : '',
              deliveryAddress4: res['data'].deliveryAddress4 ? res['data'].deliveryAddress4 : '',
              postalCode: res['data'].postalCode ? res['data'].postalCode : '',
              physicalCode: res['data'].physicalCode ? res['data'].physicalCode : '',
              active: res['data'].active ? res['data'].active : false,
              sameAs: res['data'].sameAs ? res['data'].sameAs : false,
              website: res['data'].website ? res['data'].website : '',
            });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    }
    if (this.customersID) {
      this.getAllCustomerContacts(this.customersID);
    }
  }

  close() {
    this.dialogRef.close();
  }

  getAllCustomerContacts(id) {
    const sub = this.customerService.getcustomersContacts(id).subscribe({
      next: (res) => {
        this.customerContacts = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getsingleContact(id) {
    this.contactId = id;
    const sub = this.customerService.getsingleContacts(id).subscribe({
      next: (res) => {
        this.contactform.patchValue({
          email: res['data'].email ? res['data'].email : '',
          name: res['data'].name ? res['data'].name : '',
          contactNo: res['data'].contactNo ? res['data'].contactNo : '',
          isDefault: res['data'].isDefault ? res['data'].isDefault : false,
        });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getCustomerCategories(active = true) {
    const sub = this.customerService.getCustomerCategories(active).subscribe({
      next: (res) => {
        this.selectcategory = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getAccountTypes() {
    const sub = this.customerService.getAccountTypes().subscribe({
      next: (res) => {
        this.selectaccount = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getRegion() {
    const sub = this.customerService.getRegion().subscribe({
      next: (res) => {
        this.selectregion = res;
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

  getStatus() {
    const sub = this.customerService.getStatus().subscribe({
      next: (res) => {
        this.selectstatuscode = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getRep() {
    const sub = this.lookupService.getByRole().subscribe({
      next: (res) => {
        this.selectrep = res;
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
      data.customerId = this.customersID;
      data.id = this.contactId;
      const sub = this.customerService
        .createOrUpdateCustomerContacts(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Customer Contact ${this.contactId ? 'Updated' : 'Created'
              } Successfully`,
              'Success'
            );
            this.getAllCustomerContacts(this.customersID);
            this.contactform.reset();
            this.contactId = null;
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    } else {
      this.contactform.markAllAsTouched();
    }
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.customersID) {
        data.id = this.customersID;
      }
      const sub = this.customerService.createOrUpdateCustomers(data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Customer ${this.customersID ? 'Updated' : 'Created'} Successfully`,
            'Success'
          );
          this.dialogRef.close();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }


  deleteContact(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.customerService.deleteContact(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllCustomerContacts(this.customersID);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
}
