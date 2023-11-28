import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRoutingModule } from './general-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { CategoriesComponent } from './categories/categories.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ActionTypesComponent } from './action-types/action-types.component';
import { EmailManagerComponent } from './email-manager/email-manager.component';
import { RemaindersComponent } from './remainders/remainders.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { NewCustomerComponent } from './customers/new-customer/new-customer.component';
import { NewCategoryComponent } from './categories/new-category/new-category.component';
import { NewSupplierComponent } from './suppliers/new-supplier/new-supplier.component';
import { NewActionTypeComponent } from './action-types/new-action-type/new-action-type.component';
import { NewEmailComponent } from './email-manager/new-email/new-email.component';
import { NewReminderComponent } from './remainders/new-reminder/new-reminder.component';
import { NewSettingComponent } from './settings/new-setting/new-setting.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';




@NgModule({
  declarations: [
    CustomersComponent,
    CategoriesComponent,
    SuppliersComponent,
    ActionTypesComponent,
    EmailManagerComponent,
    RemaindersComponent,
    SettingsComponent,
    NewCustomerComponent,
    NewCategoryComponent,
    NewSupplierComponent,
    NewActionTypeComponent,
    NewEmailComponent,
    NewReminderComponent,
    NewSettingComponent
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule, 
    HttpClientModule,
    FormControllerModule,
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        blockquote: 'Blockquote',
        underline: 'Underline',
        strike: 'Strike',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',

        // popups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    })
  ]
})
export class GeneralModule { }
