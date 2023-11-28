import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { filter, Subscription, switchMap } from 'rxjs';
import { OverRideComponent } from 'src/app/shared/form-controller/over-ride/over-ride.component';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { CustomerService } from 'src/_services/rest/customer.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { QuoteService } from 'src/_services/rest/quote.service';
import { changeDateToApiFormat } from 'src/_services/utility';
import { BrandingDetailsComponent } from './branding-details/branding-details.component';
import { PDFComponent } from './pdf/pdf.component';
import { SearchProductsComponent } from './search-products/search-products.component';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  lineItemForm: FormGroup;
  categoryform: FormGroup;
  data: [] = [];
  pushedData: any[] = [];
  overRideBit : boolean=false;
  supplierID: number = 0;
  productID: number = 0;
  supplier: string = '';
  ids: any[] = [];
  selectCustomer: lookupdata[] = [];
  selectContactName: lookupdata[] = [];
  selectContactEmail: lookupdata[] = [];
  selectJobType: lookupdata[] = [];
  selectRep: lookupdata[] = [];
  selectDelivery: lookupdata[] = [];
  selectLeadTime: lookupdata[] = [];
  selectDiscount: lookupdata[] = [];
  selectSize: lookupdata[] = [];
  selectColour: lookupdata[] = [];
  selectWeight: lookupdata[] = [];
  selectJobStatus: lookupdata[] = [];
  selling: string = '';
  markup: string = '';
  productCode: string = null;
  lineId: number = 0;
  originalSellingPrice: number = 0;
  originalCostPrice: number = 0;
  originalMarkUp: number = 0;
  quoteId: any = undefined;
  idForUpdate: any;
  paramsOptions: Params = {};
  sub: Subscription;
  title: string = 'New Quote';
  embedImage: boolean = false;
  orderNo : number=0;
  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private lookupService: LookUpService,
    private quotesService: QuoteService,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private messageService: MessageService,
    private customerService: CustomerService) {
    this.selectDiscount = this.lookupService.increment();
    this.form = this.formBuilder.group({
      customerId: [null, [Validators.required]],
      contactName: [null, [Validators.required, Validators.maxLength(64)]],
      contactEmail: [null, [Validators.required, Validators.maxLength(128)]],
      jobTypeId: [null, [Validators.required]],
      customerOrderNo: [null, [Validators.maxLength(32)]],
      quoteNo: [null],
      quoteDate: [null],
      orderNo: [null],
      orderDate: [null],
      jobName: [null, Validators.maxLength(250)],
      repId: [null, [Validators.required]],
      jobStatusId: [95],
      deliveryId: [null],
      leadTimeId: [null],
      discount: [null],
      deliveryDate: [null],
      deadlineDate: [null],
      specialInstructions: [null, [Validators.maxLength(1000)]],
      deliveryAddress: [null, [Validators.maxLength(1000)]],

    });
    this.lineItemForm = this.formBuilder.group({
      supplierId: [''],
      category: [''],
      productId: [''],
      sizeId: [null, [Validators.required]],
      weightId: [null, [Validators.required]],
      colourId: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      costPrice: [null, [Validators.required]],
      sellingPrice: [null, [Validators.required]],
      markup: [null, [Validators.required]],
      notes: ['', [Validators.maxLength(5000)]],
      lineDiscount: [null],
    })

    this.sub = this.route.queryParams.subscribe(params => {
      this.title = (params['title']) ? params['title'] : "New Quote";
      this.paramsOptions = params;
      this.quoteId = params['quoteId'];
      if (!this.quoteId) {
        this.form.reset();
        this.getMarkUp();
        this.form.patchValue({
          jobStatusId: 95
        })
        this.pushedData = [];
      }
      if (this.paramsOptions['repeatOrder'] || this.paramsOptions['repeatQuote']) {
        this.reapeatQuote(this.quoteId);
        this.quoteId = undefined;
      }
    });
    if (this.quoteId != undefined) {
      const sub = this.quotesService.viewQuote(this.quoteId).subscribe({
        next: res => {
          this.orderNo = res['data'].orderNo;
          if (this.paramsOptions['repeatOrder'] || this.paramsOptions['reOpenOrder'] || this.paramsOptions['repeatQuote']) {
            this.patchForm(res['data'], (this.paramsOptions['reOpenOrder']) || (this.paramsOptions['reOpenQuote']) ? true : false);
            if (this.paramsOptions['repeatQuote']) {
              this.quoteId = undefined;
            }
          } else {

            this.patchForm(res['data']);
          }
          this.pushedData = res['data'].quoteDetails;
          this.getContactNames(res['data'].customerId, true);
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
   
  }
  findName(list: lookupdata[], id: string, keyId: string = "value", keyName: string = "name"): string {
    let item = list.filter(e => e[keyId] == id);
    return (item.length > 0) ? item[0][keyName] : "";
  }
  onDestroy() {

  }
  patchForm(data, status = false) {
    let jobStatusId = data.jobStatusId ? data.jobStatusId : '';
    if (status) {
      jobStatusId = 95;
    }
    this.form.patchValue({
      customerId: data.customerId ? ({ name: data.customer, value: data.customerId }):'',
      contactEmail: data.contactEmail ? data.contactEmail : '',
      contactName: data.contactName ? data.contactName : '',
      customerOrderNo: data.customerOrderNo ? data.customerOrderNo : '',
      jobTypeId: data.jobTypeId ? data.jobTypeId : '',
      quoteNo: (this.paramsOptions['repeatQuote']) ? " " : data.quoteNo ? data.quoteNo : '',
      orderNo: (this.paramsOptions['repeatQuote']) ? " " : data.orderNo ? data.orderNo : '',
      quoteDate: (this.paramsOptions['repeatQuote']) ? null : data.quoteDate ? data.quoteDate : null,
      orderDate: (this.paramsOptions['repeatQuote']) ? null : data.orderDate ? data.orderDate : null,
      jobName: data.jobName ? data.jobName : '',
      repId: data.repId ? data.repId : '',
      specialInstructions: data.specialInstructions ? data.specialInstructions : '',
      deliveryAddress: data.deliveryAddress ? data.deliveryAddress : '',
      deliveryId: data.deliveryId ? data.deliveryId : '',
      leadTimeId: data.leadTimeId ? data.leadTimeId : '',
      discount: data.discount ? data.discount : '',
      deliveryDate: data.deliveryDate ? data.deliveryDate : null,
      deadlineDate: data.deadlineDate ? data.deadlineDate : null,
      jobStatusId: jobStatusId
    })
  }

  ngOnInit(): void {
    // this.getCustomers();
    this.getJobTypes();
    this.getRep();
    this.getDeliveryOptions();
    this.getLeadTimes();
    this.getMarkUp();
    this.getJobStatus();
  }

  searchProducts() {
    this.lineItemForm.reset();
    this.embedImage = false;
    this.lineId = 0;
    this.getMarkUp();
    const DialogRef = this.dialog.open(SearchProductsComponent, {
      width: '80%',
      height: '80%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe(result => {
      this.getSize({ supplierId: result.supplierId, productId: result.productId });
      this.getColor({ supplierId: result.supplierId, productId: result.productId });
      this.getWeight({ supplierId: result.supplierId, productId: result.productId });
      this.supplierID = result.supplierId;
      this.supplier = result.supplier;
      this.productID = result.productId;
      this.productCode = result.productCode;
      this.embedImage = result.imgUrl;
      this.lineItemForm.patchValue({
        supplierId: result.supplier ? result.supplier : '',
        category: result.supplier ? result.category : '',
        productId: result.product ? result.productCode + ', ' + result.product : ' '
      })
      sub.unsubscribe();
    });
  }

  reapeatQuote(id) {
    const sub = this.quotesService.repeatQuote(id).subscribe({
      next: (res) => {
        this.patchForm(res['data']);
        this.getContactNames(res['data'].customerId, true);
        this.pushedData = res['data'].quoteDetails;
        this.pushedData.forEach((item, i) => {
          item._id = i + 1;
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  sellingChange(selling, cost) {
    const s = parseFloat(selling);
    const c = parseFloat(cost);
    const res: number = (s - c) / c * 100;
    this.markup = res.toFixed(2)
  }

  newSelling(cost, markup) {
    const c = parseFloat(cost);
    const m = parseFloat(markup);
    const res: any = c + (c * (m / 100));
    this.selling = res.toFixed(2);
  }

  // discount(discount) {
  //   const dis = (discount > 0) ? discount : 0;
  //   const res: any = (dis != 0) ? this.originalSellingPrice - (this.originalSellingPrice * dis / 100) : this.originalSellingPrice;
  //   this.selling = res.toFixed(2);
  // }

  removeLine(id) {
    const ind = this.pushedData.findIndex(object => {
      return object._id === id || object.quoteDetailId ===id;
    });
    this.pushedData.splice(ind, 1);
    this.lineId = 0;
    return null;
  }

  brandingPopup(supplierId, productId, quantity, _id, printings) {
    const DialogRef = this.dialog.open(BrandingDetailsComponent, {
      data: { supplierId: supplierId, productId: productId, quantity: quantity, _id: _id, printings: printings },
      width: '70%',
      height: '75%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe(result => {
  
      this.pushedData.forEach((item, i) => {
       
        // let data = this.pushedData.find(obj => { return obj._id === this.lineId || obj.quoteDetailId === this.lineId });/
        const lineData = result.find((obj => { return obj._id === item._id || obj.quoteDetailId === item._id }));
       
        if (lineData != undefined && (lineData._id == item._id || lineData._id == item.quoteDetailId)) {
          item.quotePrintings = result;
        }
      })
      sub.unsubscribe();
    });
  }

  DisplayPDF(data) {
    const DialogRef = this.dialog.open(PDFComponent, {
      data: { data: data , from: this.paramsOptions['source']},
      width: '70%',
      height: '50%',
      disableClose: true,
    });
  }

  pushData() {
    if (this.lineItemForm.valid) {
      const formData = this.lineItemForm.value;
      const product = (formData.productId.includes(','))?formData.productId.split(', ')[1]: formData.productId;
      if (this.lineId != 0) {
        let data = this.pushedData.find(obj => { return obj._id === this.lineId || obj.quoteDetailId === this.lineId });
        
        let index = this.pushedData.indexOf(data);
       
        this.pushedData[index] = {
          _id: this.lineId, productId: this.productID, productCode: this.productCode, supplierId: this.supplierID, supplier: this.supplier, category: formData.category, product: product,
          weightId: formData.weightId, weight: this.findName(this.selectWeight, formData.weightId), sizeId: formData.sizeId, size: this.findName(this.selectSize, formData.sizeId), colourId: formData.colourId, colour: this.findName(this.selectColour, formData.colourId), markup: parseFloat(formData.markup).toFixed(2),
          quantity: formData.quantity, costPrice: parseFloat(formData.costPrice).toFixed(2), sellingPrice: parseFloat(formData.sellingPrice).toFixed(2), lineDiscount: formData.lineDiscount, embedImage: this.embedImage, notes: formData.notes
        }
        if (data.quotePrintings?.length > 0) {
          this.pushedData[index].quotePrintings = data.quotePrintings;
        }
        
        if (data.quoteDetailId) {
          this.pushedData = this.pushedData.map(({
            _id: quoteDetailId,
            ...rest
          }) => ({
            quoteDetailId,
            ...rest
          }));
        
        }
        this.lineId = 0;
      } else {
        this.pushedData.push({
          productId: this.productID, productCode: this.productCode, supplierId: this.supplierID, supplier: this.supplier, category: formData.category, product: product,
          weightId: formData.weightId, weight: this.findName(this.selectWeight, formData.weightId), sizeId: formData.sizeId, size: this.findName(this.selectSize, formData.sizeId), colourId: formData.colourId, colour: this.findName(this.selectColour, formData.colourId), markup: parseFloat(formData.markup).toFixed(2),
          quantity: formData.quantity, costPrice: parseFloat(formData.costPrice).toFixed(2), sellingPrice: parseFloat(formData.sellingPrice).toFixed(2), lineDiscount: formData.lineDiscount, embedImage: this.embedImage, notes: formData.notes
        });
        this.pushedData.forEach((item, i) => {
          item._id = i + 1;
        })
      }
      this.getMarkUp();
    } else {
      this.lineItemForm.markAllAsTouched()
    }
  }

  editForm(id) {
    let data = this.pushedData.find(obj => { return obj._id === id || obj.quoteDetailId === id });
    this.lineId = id;
    
    this.productCode = data.productCode;
    this.getSize({ supplierId: data.supplierId, productId: data.productId });
    this.getColor({ supplierId: data.supplierId, productId: data.productId });
    this.getWeight({ supplierId: data.supplierId, productId: data.productId });
    this.supplierID = data.supplierId;
    this.productID = data.productId;
    this.supplier = data.supplier;
    this.lineItemForm.patchValue({
      supplierId: data.supplier,
      category: data.category,
      productId: data.product,
      weightId: data.weightId,
      sizeId: data.sizeId,
      colourId: data.colourId,
      quantity: data.quantity,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      markup: data.markup,
      lineDiscount: data.lineDiscount,
      notes: data.notes,
    })
  }

  clearForm() {
    this.lineItemForm.get('supplierId')?.reset();
    this.lineItemForm.get('category')?.reset();
    this.lineItemForm.get('productId')?.reset();
    this.lineItemForm.get('weightId')?.reset();
    this.lineItemForm.get('sizeId')?.reset();
    this.lineItemForm.get('colourId')?.reset();
    this.lineItemForm.get('quantity')?.reset();
    this.lineItemForm.get('costPrice')?.reset();
    this.lineItemForm.get('sellingPrice')?.reset();
    this.lineItemForm.get('lineDiscount')?.reset();
    this.lineItemForm.get('notes ')?.reset();
  }

  getCustomers() {
    if (this.form.value.customerId.length > 2) {
      const sub = this.lookupService.getCustomers({ description: this.form.value.customerId, active: true }).subscribe({
        next: (res) => {
          this.selectCustomer = res;
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  getContactNames(event, byPass = false) {
    const value = (event?.option) ? event.option.value.value : event;
    
    if (!this.quoteId) {
      const sub = this.customerService.getSingleCustomer(value).subscribe({
        next: res => {
          const address = res['data'].deliveryAddress1 + (res['data'].deliveryAddress1) ? " " : '' + res['data'].deliveryAddress2 + (res['data'].deliveryAddress2) ? " " : '' + res['data'].deliveryAddress3 + (res['data'].deliveryAddress3) ? " " : '' + res['data'].deliveryAddress4;
          this.form.patchValue({
            deliveryAddress: address,
          })
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      })
    }
    const contactName: lookupdata[] = [];
    const contactEmail: lookupdata[] = [];
    const sub2 = this.lookupService.getCustomersContactData(value).subscribe({
      next: (res) => {
        if (typeof res['data'] != 'string') {
          res['data'].forEach(el => {
            if (!byPass) {
              if (el.isDefault) {
                this.form.patchValue({
                  contactEmail: el.email,
                  contactName: el.name,
                })
              } else {
                this.form.patchValue({
                  contactEmail: res['data'][0].email,
                  contactName: res['data'][0].name,
                })
              }
            }
            contactName.push({ name: el.name, value: el.name })
            contactEmail.push({ name: el.email, value: el.email })
          });
        } else {
          this.toaster.error(res['data'], 'Not Found');
          this.form.patchValue({
            contactEmail: [],
            contactName: [],
          })
        }
        this.selectContactName = contactName;
        this.selectContactEmail = contactEmail;
        sub2.unsubscribe();
      },
      error: (res) => {
        sub2.unsubscribe();
      },
    });
  }

  changeEmail() {
    
    const sub = this.customerService.getSingleCustomerContact({ name: this.form.value.contactName, customerId: this.form.value.customerId.value }).subscribe({
      next: res => {
        this.form.patchValue({
          contactEmail: res['data'][0].email,
        })
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    })
  }
  changeName() {
    
    const sub = this.customerService.getSingleCustomerContact({ email: this.form.value.contactEmail, customerId: this.form.value.customerId.value }).subscribe({
      next: res => {
        this.form.patchValue({
          contactName: res['data'][0].name,
        })
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    })
  }

  getJobTypes() {
    const sub = this.lookupService.getJobTypeFromRef({ active: true }).subscribe({
      next: (res) => {
        this.selectJobType = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getJobStatus() {
    const sub = this.lookupService.getJobStatus().subscribe({
      next: (res) => {
        this.selectJobStatus = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getRep() {
    const sub = this.lookupService.getByRole({ active: true }).subscribe({
      next: (res) => {
        this.selectRep = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getDeliveryOptions() {
    const sub = this.lookupService.getDeliveryOptions().subscribe({
      next: (res) => {
        this.selectDelivery = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getLeadTimes() {
    const sub = this.lookupService.getLeadTimes({ active: true }).subscribe({
      next: (res) => {
        this.selectLeadTime = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getMarkUp() {
    const sub = this.quotesService.getMarkUp().subscribe({
      next: (res) => {
        this.originalMarkUp = res['data'].price ? res['data'].price : 0;
        this.lineItemForm.patchValue({
          markup: this.originalMarkUp.toFixed(2)
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getSize(params) {
    const sub = this.quotesService.getSize(params).subscribe({
      next: (res) => {
        this.selectSize = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getColor(params) {
    const sub = this.quotesService.getColor(params).subscribe({
      next: (res) => {
        this.selectColour = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getWeight(params) {
    const sub = this.quotesService.getWeight(params).subscribe({
      next: (res) => {
        this.selectWeight = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getCost() {
    let formData = this.lineItemForm.value;
    if (this.supplierID && this.productID && formData.sizeId && formData.colourId && formData.weightId) {
      this.getCostSelling();
    }
  }

  getCostSelling() {
    let formData = this.lineItemForm.value;
    const sub = this.quotesService.getCostSelling({ noloading: true, supplierId: this.supplierID, productId: this.productID, sizeId: formData.sizeId, colourId: formData.colourId, weightId: formData.weightId }).subscribe({
      next: (res) => {
        this.originalSellingPrice = res['data'].sellingPrice ? res['data'].sellingPrice : 0;
        this.originalCostPrice = res['data'].costPrice ? res['data'].costPrice : 0,
          this.lineItemForm.patchValue({
            costPrice: this.originalCostPrice.toFixed(2),
            sellingPrice: this.originalSellingPrice.toFixed(2)
          })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  deleteQuoteLine(id: number, quoteDetailId: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          if (id) {
            return this.removeLine(id)
          } else {
            return this.quotesService.deleteQuoteLine(quoteDetailId);
          }
        })
      ).subscribe({
        next: (res) => {
          this.removeLine(quoteDetailId);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  onsubmit() {
    this.lineItemForm.clearValidators();
    if (this.form.valid) {
      const data = Object.assign(this.form.value);
      if (this.quoteId) {
        data.id = this.quoteId;
      }
      let deliveryPrice = this.findName(this.selectDelivery, data.deliveryId, "value", "id");
      data.delivery = deliveryPrice;
      data.customerId = (typeof this.form.value.customerId != "object") ? this.form.value.customerId : this.form.value.customerId.value;
      data.deliveryDate = changeDateToApiFormat(this.form.value.deliveryDate);
      data.deadlineDate = changeDateToApiFormat(this.form.value.deadlineDate);
      delete data.quoteNo;
      delete data.quoteDate;
      delete data.orderNo;
      delete data.orderDate;
      delete data.supplierId;
      delete data.category;
      delete data.productId;
      delete data.sizeId;
      delete data.weightId;
      delete data.colourId;
      delete data.quantity;
      delete data.costPrice;
      delete data.sellingPrice;
      delete data.markup;
      delete data.notes;
      delete data.lineDiscount;
      // delete data.imageUrl;
      data.quoteDetails = this.pushedData;
      const sub = this.quotesService
        .createQuote(data)
        .subscribe({
          next: (res) => {
            if (res['statusDescription'] == 'Ok') {
              this.toaster.success( 
                (this.paramsOptions['source'])? `Order ${(this.quoteId) ? 'Updated' : 'Created'} Successfully` : `Quote ${(this.quoteId) ? 'Updated' : 'Created'} Successfully`,
                'Success'
              );
              
              this.form.reset();
              this.pushedData = [];
             
              this.DisplayPDF(res['data']);
            }
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
    this.sub.unsubscribe();
  }
  overRide() {
    const DialogRef = this.dialog.open(OverRideComponent, {
      data: { overrideFunction: 'OverrideQuote' },
      minWidth: '30%',
      minHeight: '30%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe(result => {
     this.overRideBit=result;
      sub.unsubscribe();
    });
  }

  displayFn(option) {
    return option?.name;
  }
}

