/* tslint:disable:member-ordering */
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { PermissionService } from 'src/_services/permission.service';


@Directive({
  selector: '[Permission]'
})
export class PermissionsDirective implements OnChanges{
  @Input('Permission') permission: string = '';

  constructor(private el: ElementRef, private _p: PermissionService) {
  }
  ngOnChanges() {
    // this.checkPermission();
  }

  // private checkPermission() {
  //   if(this.permission) {
  //     const p = this.permission.split(',');
  //     if (!this._p.havePerm(p)) {
  //       this.el.nativeElement.remove();
  //     }
  //   }
  // }
}