import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Optional, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/_services/auth.service';
import { LeftMenuService } from 'src/_services/rest/leftMenu.service';
import { environment } from "src/environments/environment";
// import { AuthService } from 'src/_services/common/auth.service';
// import { MessageService } from 'src/_services/common/message.service';

import { ChangePasswordPopupComponent } from '../change-password-popup/change-password-popup.component';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {
  localMenu = [
    {
      item: "Users",
      group: "Users, Roles, Targets",
      url: "/users/user"
    },
    {
      item: "Permissions",
      group: "Users, Roles, Targets",
      url: "/users/role"
    },
    {
      item: "Sales Targets",
      group: "Users, Roles, Targets",
      url: "/users/target"
    },
    {
      item: "Departments",
      url: "/"
    },
    {
      item: "Product Prices",
      url: "/"
    },
    {
      item: "Import",
      group: "Pricing",
      url: "/pricing/import"
    },
    {
      item: "Print Prices",
      url: "/"
    },
    {
      item: "Extra Prices",
      group: "Pricing",
      url: "/pricing/extra-prices"
    },
    {
      item: "Specials",
      url: "/"
    },
    {
      item: "Customers - Add",
      url: "/"
    },
    {
      item: "Customers - Edit",
      url: "/"
    },
    {
      item: "Customers - Delete",
      url: "/"
    },
    {
      item: "Customers - Export",
      url: "/"
    },
    {
      item: "Customers - Import",
      url: "/"
    },
    {
      item: "Customers",
      group: "General",
      url: "/general/customers"
    },
    {
      item: "Customer Categories",
      group: "General",
      url: "/general/categories"
    },
    {
      item: "Suppliers",
      group: "General",
      url: "/general/suppliers"
    },
    {
      item: "Action Types",
      group: "General",
      url: "/general/action-types"
    },
    {
      item: "Print Positions",
      group: "Products",
      url: "/products/print-positions"
    },
    {
      item: "Themes",
      url: "/"
    },
    {
      item: "Email Manager",
      group: 'General',
      url: "/general/email-manager"
    },
    {
      item: "SMS Manager",
      url: "/"
    },
    {
      item: "Reminders",
      group: "General",
      url: "/general/reminders"
    },
    {
      item: "Settings",
      group: "General",
      url: "/general/settings"
    },
    {
      item: "Products",
      group: "Products",
      url: "/products/product"
    },
    {
      item: "Product Ratios",
      url: "/"
    },
    {
      item: "Categories",
      group: "Products",
      url: "/products/categories"
    },
    {
      item: "Branding",
      group: "Products",
      url: "/products/branding"
    },
    {
      item: "Colours",
      group: "Products",
      url: "/products/colours"
    },
    {
      item: "Sizes",
      group: "Products",
      url: "/products/sizes"
    },
    {
      item: "Weights",
      group: "Products",
      url: "/products/weights"
    },
    {
      item: "Components",
      url: "/"
    },
    {
      item: "Bill Of Materials",
      url: "/"
    },
    {
      item: "Component Stock",
      url: "/"
    },
    {
      item: "Machines",
      url: "/"
    },
    {
      item: "Bin Locations",
      url: "/"
    },
    // {
    //   item: "Reports",
    //   group: "Reports",
    //   url: "/"
    // },
    {
      item: "Leads New",
      url: "/"
    },
    {
      item: "Leads - Add",
      url: "/"
    },
    {
      item: "Leads - Edit",
      url: "/"
    },
    {
      item: "Leads - Quote From Lead",
      url: "/"
    },
    {
      item: "Leads Assign",
      url: "/"
    },
    {
      item: "Leads Current",
      url: "/"
    },
    {
      item: "Leads History",
      url: "/"
    },
    {
      item: "Override",
      url: "/"
    },
    {
      item: "Search",
      group: "Quotes",
      url: "/quotes/search-quotes"
    },
    {
      item: "New",
      group: "Quotes",
      url: "/quotes/new-quotes"
    },
    {
      item: "Quick",
      group: "Quotes",
      url: "/"
    },
    {
      item: "Current",
      group: "Quotes",
      url: "/quotes/current-quotes"
    },
    {
      item: "History",
      group: "Quotes",
      url: "/quotes/quotes-history"
    },
    {
      item: "Quote History Filter",
      url: "/"
    },
    {
      item: "Repeat",
      group: "Quotes",
      url: "/quotes/repeat-quotes"
    },
    {
      item: "Review Quote",
      url: "/"
    },
    {
      item: "Override Quote",
      url: "/"
    },
    {
      item: "Edit Quote Detail",
      url: "/"
    },
    {
      item: "Action List From Current Quotes",
      url: "/"
    },
    {
      item: "Quote Import Product Details",
      url: "/"
    },
    {
      item: "Override Rep In Quote",
      url: "/"
    },
    {
      item: "Send Auto Follow Ups",
      url: "/"
    },
    {
      item: "Quotes - Lock Cost Price",
      url: "/"
    },
    {
      item: "Quotes - Lock Selling Price",
      url: "/"
    },
    {
      item: "Quotes - Lock Markup",
      url: "/"
    },
    {
      item: "Search",
      group: "Orders",
      url: "/orders/search-orders"
    },
    {
      item: "Current",
      group: "Orders",
      url: "/orders/current-orders"
    },
    {
      item: "History",
      group: "Orders",
      url: "/orders/order-history"
    },
    {
      item: "Order History Filter",
      url: "/"
    },
    {
      item: "Repeat",
      group: "Orders",
      url: "/orders/repeat-orders"
    },
    {
      item: "Orders - Open Order",
      url: "/"
    },
    {
      item: "Accept Order",
      url: "/"
    },
    {
      item: "Send Order",
      url: "/"
    },
    {
      item: "Reject Order",
      url: "/"
    },
    {
      item: "Part Invoicing",
      url: "/"
    },
    {
      item: "Repeat Artwork",
      url: "/"
    },
    {
      item: "Send Artwork Follow Up To Customer",
      url: "/"
    },
    {
      item: "Send Artwork Follow Up To Supplier",
      url: "/"
    },
    {
      item: "Send Deposit Follow Up",
      url: "/"
    },
    {
      item: "Send Action List",
      url: "/"
    },
    {
      item: "Change Grid Colour",
      url: "/"
    },
    {
      item: "Bulk Invoices",
      url: "/"
    },
    {
      item: "Bulk Credit Notes",
      url: "/"
    },
    {
      item: "Bulk Dispatch Notes",
      url: "/"
    },
    {
      item: "Orders - Bulk Close",
      url: "/"
    },
    {
      item: "Re-Open Order",
      url: "/"
    },
    {
      item: "Back Orders Current",
      url: "/"
    },
    {
      item: "Back Orders History",
      url: "/"
    },
    {
      item: "Returns Current",
      url: "/"
    },
    {
      item: "Returns History",
      url: "/"
    },
    {
      item: "Returns Reject",
      url: "/"
    },
    {
      item: "Override Returns",
      url: "/"
    },
    {
      item: "Replacements New",
      url: "/"
    },
    {
      item: "Replacements Current",
      url: "/"
    },
    {
      item: "Replacements History",
      url: "/"
    },
    {
      item: "Action List",
      url: "/"
    },
    {
      item: "Action List",
      url: "/"
    },
    {
      item: "Action List",
      url: "/"
    },
    {
      item: "Search",
      url: "/"
    },
    {
      item: "Search",
      url: "/"
    },
    {
      item: "Delete Action List Attachments",
      url: "/"
    },
    {
      item: "Delete Action List Attachments",
      url: "/"
    },
    {
      item: "Override Action List",
      url: "/"
    },
    {
      item: "Production Sheet",
      url: "/"
    },
    {
      item: "Art Department List",
      url: "/"
    },
    {
      item: "Calendar List",
      url: "/"
    },
    {
      item: "Picking Slip",
      url: "/"
    },
    {
      item: "Override Picking Slip",
      url: "/"
    },
    {
      item: "Lay Plan",
      url: "/"
    },
    {
      item: "Lay Plans Current",
      url: "/"
    },
    {
      item: "Receiving Note",
      // group: "Receiving",
      url: "/workflow/receiving-notes"
    },
    {
      item: "Receiving List",
      url: "/"
    },
    {
      item: "Dispatch Note",
      url: "/"
    },
    {
      item: "Dispatch List",
      url: "/"
    },
    {
      item: "Branding Purchase Order",
      url: "/"
    },
    {
      item: "Branding Purchase Order",
      url: "/"
    },
    {
      item: "Purchase Order",
      url: "/"
    },
    {
      item: "Purchase Order",
      url: "/"
    },
    {
      item: "Delete Purchase Order",
      url: "/"
    },
    {
      item: "Delete Purchase Order",
      url: "/"
    },
    {
      item: "Deposits Paid",
      url: "/"
    },
    {
      item: "Deposits Paid",
      url: "/"
    },
    {
      item: "Finance List",
      url: "/"
    },
    {
      item: "Current",
      group: "Complaints",
      url: "/workflow/current-complaint"
    },
    {
      item: "Complaints Resolve",
      url: "/"
    },
    {
      item: "Complaints Resolve",
      url: "/"
    },
    {
      item: "Complaints Resolve",
      url: "/"
    },
    {
      item: "History",
      group: "Complaints",
      url: "/workflow/complaint-history"
    },
    {
      item: "Tasks",
      group: "Tasks",
      url: ""
    },
    {
      item: "New",
      group: "Tasks",
      url: "/workflow/task"
    },
    {
      item: "Current",
      group: "Tasks",
      url: "/workflow/current-task"
    },
    {
      item: "History",
      group: "Tasks",
      url: "/workflow/task-history"
    },
    {
      item: "Stock Takes New",
      url: "/"
    },
    {
      item: "Stock Takes Current",
      url: "/"
    },
    {
      item: "Stock Takes Current",
      url: "/"
    },
    {
      item: "Stock Takes History",
      url: "/"
    },
    {
      item: "Stock Movement New",
      url: "/"
    },
    {
      item: "Start / Stop Branding",
      url: "/"
    },
    {
      item: "Internal Purchase Order New",
      url: "/"
    },
    {
      item: "Internal Purchase Orders Current",
      url: "/"
    },
    {
      item: "Internal Purchase Order Receive",
      url: "/"
    },
    {
      item: "Internal Purchase Order Reject",
      url: "/"
    },
    {
      item: "Internal Purchase Order History",
      url: "/"
    },
    {
      item: "Stock Transfer",
      url: "/"
    },
    {
      item: "Inventory Movement History",
      url: "/"
    },
    {
      item: "Stock Reserve New",
      url: "/"
    },
    {
      item: "Stock Reserve Current",
      url: "/"
    },
    {
      item: "Stock Reserve History",
      url: "/"
    },
    {
      item: "POS Sales",
      url: "/"
    },
    {
      item: "POS Tender Cash",
      url: "/"
    },
    {
      item: "POS Tender Cheque",
      url: "/"
    },
    {
      item: "POS Tender Card",
      url: "/"
    },
    {
      item: "POS Tender EFT",
      url: "/"
    },
    {
      item: "POS Tender Voucher",
      url: "/"
    },
    {
      item: "POS Tender Account",
      url: "/"
    },
    {
      item: "POS Overall Discount",
      url: "/"
    },
    {
      item: "POS Line Item Discount",
      url: "/"
    },
    {
      item: "POS Returns",
      url: "/"
    },
    {
      item: "POS Cash Up",
      url: "/"
    },
    {
      item: "POS Setup",
      url: "/"
    }
  ];
  leftMenuData: any[] = [];
  icons = [
    {
      title: "Admin",
      icon: "bi-gear-fill",
    },
    {
      title: "Quotes",
      icon: "bi-file-text",
    },
    {
      title: "Orders",
      icon: "bi-flower2",
    },
    {
      title: "Workflow",
      icon: "bi-check2-square",
    },
    // {
    //   title: "Stock",
    //   icon: "bi-bar-chart",
    // },
    // {
    //   title: "POS",
    //   icon: "bi-bar-chart",
    // }
  ];
  topmenu: boolean = false;

  companyName: string = null;
  userName: string = null;
  activeUrl = "";
  reportUrl = "";
  constructor(
    @Optional() private dialogRef: MatDialogRef<ChangePasswordPopupComponent>, private dialog: MatDialog, private _authService: AuthService, private _leftMenuService: LeftMenuService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.activeUrl = this.router.url;
    this.getReport();
  }
  navigateChild(url: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigateByUrl(url);
  }
  ngOnInit(): void {
    if (this._authService.isLoggedIn) {
      this.getLeftMenuData(this._authService.userDetails.nameid);
      this.companyName = this._authService.userDetails.ClientName;
      this.userName = this._authService.userDetails.UserName;
    }

  }
  getIcon(title: string): string {
    const d = this.icons.filter(e => e.title == title);
    if (d.length > 0) {
      return d[0].icon;
    }
    return "";
  }
  getUrl(group: string, item: string): string {
    const d = this.localMenu.filter(e => e.item == item && e.group == group);
    if (d.length > 0) {
      return d[0].url;
    }
    return "";
  }
  newDialog() {
    const DialogRef = this.dialog.open(ChangePasswordPopupComponent, {
      data: { email: this._authService.userDetails.unique_name },
      width: '30%',
      height: '70%',
      disableClose: true
    });

  }
  logout() {
    this._authService.logout();
  }
  getChilds(item: any[]): any[] {
    return item
      .filter(e => e.roleAllowed)
      ;
  }
  removeClass() {
    this.renderer.removeClass(this.document.body, 'sidebar-enable');
  }
  openMenu(index, childIndex = -1) {
    this.leftMenuData.forEach((e, i) => {
      if (i != index) {
        e.open = false;
      }
      this.leftMenuData[index]["menuGroups"].forEach((c, x) => {
        if (x != childIndex) {
          c.open = false;
        }
      });
    });
    if (childIndex > -1) {
      this.leftMenuData[index]["menuGroups"][childIndex]["open"] = !this.leftMenuData[index]["menuGroups"][childIndex]["open"];
    } else {
      this.leftMenuData[index]["open"] = !this.leftMenuData[index]["open"];
    }
  }
  getLeftMenuData(userId: string) {
    const sub = this._leftMenuService.leftMenuData(userId).subscribe({
      next: res => {
        this.leftMenuData = res['data'];
        this.leftMenuData.forEach(e => {
          e["menuGroups"].forEach(b => {
            this.getChilds(b.menuItems).forEach(c => {
              if (this.getUrl(b.group, c.item) == this.activeUrl) {
                b.open = true;
                e.open = true;
              }
            });
          });
        });
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  getReport() {
    const sub = this._leftMenuService.getReportUrl().subscribe({
      next: res => {
        this.reportUrl = res['data'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

}
