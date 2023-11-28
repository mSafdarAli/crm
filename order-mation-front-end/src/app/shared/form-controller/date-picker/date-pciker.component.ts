import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
	parse: {
		dateInput: 'DD-MM-YYYY',
	},
	display: {
		dateInput: 'dddd, LL',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};

@Component({
	selector: 'app-date-picker',
	templateUrl: './date-pciker.component.html',
	styleUrls: ['./date-pciker.component.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
	]
})
export class DatePcikerComponent implements OnInit {
	@Input() fControl!: FormControl;
	@Input() public placeholderText: string = '';
	@Input() disabled: boolean = false;
	@Input() public startView: 'month' | 'year' | 'multi-year' = 'month';

	constructor() {
	}
	ngOnInit() {
	}
	closeDatePicker(eventData: any, picker?: any, isclose: boolean = false) {
		if (isclose) {
			picker.close();
		}
	}
	focusOpen(picker) {
		if(!(('ontouchstart' in window) || (navigator.maxTouchPoints > 0))) {
			picker.open();
		}
	}
}
