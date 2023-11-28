import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { VMessageComponent } from './v-message/v-message.component';
import { LbAutoCompleteComponent } from './lb-auto-complete/lb-auto-complete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PermissionsDirective } from './permissions.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePcikerComponent } from './date-picker/date-pciker.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PromptComponent } from './prompt/prompt.component';
import { LoadingComponent } from './loading/loading.component';
import { NotesCommentsComponent } from './notes-comments/notes-comments.component';
import { MatStepperModule } from '@angular/material/stepper';
import { OverRideComponent } from './over-ride/over-ride.component';
import { ActionListComponent } from './action-list/action-list.component';
import { ViewAttachmentComponent } from './view-attachment/view-attachment.component';
import { ViewComponent } from './action-list/view/view.component';



@NgModule({
	declarations: [
		VMessageComponent,
		PermissionsDirective,
		LbAutoCompleteComponent,
		DatePcikerComponent,
		PromptComponent,
		LoadingComponent,
		NotesCommentsComponent,
		OverRideComponent,
		ActionListComponent,
  ViewAttachmentComponent,
  ViewComponent	
	],
	entryComponents: [DatePcikerComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatRippleModule,
		MatCheckboxModule,
		MatDialogModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatAutocompleteModule,
		MatTabsModule,
		MatChipsModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatMenuModule,
		MatStepperModule
	],
	exports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		LoadingComponent,
		MatInputModule,
		VMessageComponent,
		MatDialogModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatButtonModule,
		LbAutoCompleteComponent,
		MatTabsModule,
		MatRippleModule,
		MatChipsModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		PermissionsDirective,
		DatePcikerComponent,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatMenuModule,		
		NotesCommentsComponent,
		MatStepperModule,
		ActionListComponent
	],
	providers: [
		// {
		// 	provide: MatPaginatorIntl, deps: [],
		// 	useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
		// }
	]
})
export class FormControllerModule { }
