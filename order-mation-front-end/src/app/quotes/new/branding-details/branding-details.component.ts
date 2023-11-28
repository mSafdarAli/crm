import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { BrandingPositionService } from 'src/_services/rest/brandingPosition.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
@Component({
  selector: 'app-branding-details',
  templateUrl: './branding-details.component.html',
  styleUrls: ['./branding-details.component.scss']
})
export class BrandingDetailsComponent implements OnInit {
  brandingform: FormGroup;
  selectsupplier: lookupdata[] = [];
  selectnoofcolours: lookupdata[] = [];
  selectposition: lookupdata[] = [];
  selecteffect: lookupdata[] = [];
  brandingID: number = 0;
  productId: number = 0;
  quantity: number = 0;
  supplierId: number = 0;
  brandingData: any[] = [];

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<BrandingDetailsComponent>,
    private lookupService: LookUpService, private brandingPositionService: BrandingPositionService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private cdRef: ChangeDetectorRef) {
    this.selectnoofcolours = this.lookupService.GetNoOfColours();
    this.brandingform = this.formBuilder.group({
      brandings: this.formBuilder.array((this.data.printings?.length > 0) ? [] : [this.newBranding()])
    });
    this.quantity = this.data.quantity;
    this.productId = this.data.productId;
    if (this.data.printings?.length > 0) {
      let controlArray = this.brandingform.get('brandings') as FormArray;
      this.data.printings.forEach((el, i) => {
        controlArray.push(this.formBuilder.group({
          supplier: el.supplierId,
          noOfColours: el.noOfColours.toString(),
          printPositionId: el.printPositionId,
          printEffectId: el.printEffectId,
          costPrice: Number(el.costPrice).toFixed(2),
          sellingPrice: Number(el.sellingPrice).toFixed(2),
          setupCost: Number(el.setupCost).toFixed(2),
          setupSelling: Number(el.setupSelling).toFixed(2),
          notes: el.notes
        }))
        this.getEffect(i);
      });
      this.brandingform.patchValue(controlArray)
    }
  }

  get brandings(): FormArray {
    return this.brandingform.get("brandings") as FormArray
  }

  newBranding(): FormGroup {
    return this.formBuilder.group({
      supplier: ["", [Validators.required]],
      noOfColours: ["", [Validators.required]],
      printPositionId: ["", [Validators.required]],
      printEffectId: ["", [Validators.required]],
      costPrice: ["", [Validators.required]],
      sellingPrice: ["", [Validators.required]],
      setupCost: ["", [Validators.required]],
      setupSelling: ["", [Validators.required]],
      notes: ["", [Validators.required, Validators.maxLength(1000)]],
    })
  }

  addBranding() {
    this.brandings.push(this.newBranding());
    this.cdRef.detectChanges();
  }

  removeBranding(i: number) {
    this.brandings.removeAt(i);
  }

  ngOnInit(): void {
    this.getSupplier();
    this.getPosition();
  }

  pushData() {
    let formData = this.brandingform.value.brandings;
    this.brandingData = [];
    if (formData.length > 0) {
      formData.forEach((el, i) => {
        this.brandingData.push({
          noOfColours: parseInt(el.noOfColours),
          printPositionId: el.printPositionId,
          printEffectId: el.printEffectId,
          supplierId: el.supplier,
          costPrice: el.costPrice,
          sellingPrice: el.sellingPrice,
          setupCost: el.setupCost,
          setupSelling: el.setupSelling,
          notes: el.notes,
          positionNo: i + 1,
          productId: this.productId,
          _id: this.data._id
        })
      });
      this.dialogRef.close(this.brandingData)
    }
    else {
      this.brandingform.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close()
  }

  getSupplier() {
    const sub = this.lookupService.getSupplier().subscribe({
      next: (res) => {
        this.selectsupplier = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getPosition() {
    const sub = this.brandingPositionService.getPosition({ group: "promo" }).subscribe({
      next: (res) => {
        this.selectposition = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getcost(index) {
    let formdata = this.brandingform.value.brandings[index];
    if (formdata.supplier && formdata.noOfColours && formdata.printEffectId && this.productId && this.quantity) {
      this.costPrices(index);
    }
  }

  getEffect(index) {
    let formData = this.brandingform.value.brandings[index];
    const sub = this.brandingPositionService.getEffect({ supplierId: formData.supplier, productId: this.productId, quantity: this.quantity }).subscribe({
      next: (res) => {
        this.selecteffect = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  costPrices(index) {
    let formData = this.brandingform.value.brandings[index];
    let numberOfColours = parseInt(formData.noOfColours);
    const sub = this.brandingPositionService.getCostPrice({ supplierId: formData.supplier, productId: this.productId, quantity: this.quantity, brandingId: formData.printEffectId, numberOfColours: numberOfColours }).subscribe({
      next: (res) => {
        this.getIndex(index).controls['costPrice'].setValue(res['data'].costPrice ? res['data'].costPrice.toFixed(2) : 0);
        this.getIndex(index).controls['sellingPrice'].setValue(res['data'].sellingPrice ? res['data'].sellingPrice.toFixed(2) : 0);
        this.getIndex(index).controls['setupCost'].setValue(res['data'].setupCost ? res['data'].setupCost.toFixed(2) : 0);
        this.getIndex(index).controls['setupSelling'].setValue(res['data'].setupSelling ? res['data'].setupSelling.toFixed(2) : 0);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });

  }

  getIndex(i): FormGroup {
    return this.brandings.controls[i] as FormGroup;
  }

  deletePosition(id: number) {
    const isub = this.messageService
      .prompt(
        `Are you sure you want to delete this record?`,
      )
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.brandingPositionService.deletePosition(id);
        }),
      ).subscribe({
        next: res => {
          // this.getAllUsers();
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        }, error: res => {
          isub.unsubscribe();
        }
      });
  }
}
