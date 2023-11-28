import {
	animate,
	keyframes,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
	selector: 'cutom-toast',
	styles: [`
	:host { display: block; }
	:host.ngx-toastr { padding: 0.75rem 1.25rem 0.75rem 60px; }
	:host.custom-icon { padding: 0.75rem 1.25rem 0.75rem 1.25rem; }
	:host.custom-icon { background-image: none; }
	.icon {width: 35px;}
	.text {width: calc(100% - calc(35px + 1.85rem));}
	`
	],
	template: `
	<div class="row" [style.display]="state.value === 'inactive' ? 'none' : ''">
		<div class="col-12">
			<div class="float-left h2 m-0 mr-2 icon">
				<i class="{{ iconClass }}"></i>
			</div>
			<div class="float-left text">
				<div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
					{{ title }}
				</div>
				<div *ngIf="message && options.enableHtml" role="alert" aria-live="polite"
					[class]="options.messageClass" [innerHTML]="message">
				</div>
				<div *ngIf="message && !options.enableHtml" role="alert" aria-live="polite"
					[class]="options.messageClass" [attr.aria-label]="message" [innerHTML]="message">
				</div>
			</div>
		</div>
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width + '%'"></div>
  </div>
  `,
	animations: [
		trigger('fadeIn', [
			state('inactive', style({ opacity: 0 })),
			transition(
				'inactive => active',
				animate(
					'300ms ease-out',
					keyframes([
						style({
							opacity: 0,
							bottom: '-15px',
							'max-height': 0,
							'max-width': 0,
							'margin-top': 0,
						}),
						style({
							opacity: 0.8,
							bottom: '-3px',
						}),
						style({
							opacity: 1,
							bottom: '0',
							'max-height': '200px',
							'margin-top': '12px',
							'max-width': '400px',
						}),
					]),
				),
			),
			state(
				'active',
				style({
					bottom: '0',
					'max-height': '200px',
					'margin-top': '12px',
					'max-width': '400px',
				}),
			),
			transition(
				'active => removed',
				animate(
					'300ms ease-out',
					keyframes([
						style({
							opacity: 1,
							transform: 'translateY(0)'
						}),
						style({
							opacity: 0,
							transform: 'translateY(25%)'
						}),
					]),
				),
			),
		]),
	],
})
export class customToast extends Toast {
	// constructor is only necessary when not using AoT
	iconClass = '';
	constructor(
		protected override toastrService: ToastrService,
		public override toastPackage: ToastPackage,
	) {
		super(toastrService, toastPackage);
		const classes = this.toastClasses.split(' ');
		switch (classes[0]) {
			case 'toast-success':
				this.iconClass = 'mdi mdi-check-circle-outline';
				break;
			case 'toast-info':
				this.iconClass = 'mdi mdi-information-outline';
				break;
			case 'toast-error':
				this.iconClass = 'mdi mdi-close-circle-outline';
				break;

			default:
				this.iconClass = 'mdi mdi-information';
				break;
		}
		this.toastClasses = classes[0] + ' ngx-toastr custom-icon';
		if (classes[1] !== 'ngx-toastr') {
			this.iconClass = classes[1] + (classes[2] ? ' ' + classes[2] : '');
		}
	}
}
