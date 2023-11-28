import { Component, OnInit, OnDestroy } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/_services/rest/loading.service';

@Component({
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy{
	load = false;
	mode = 'indeterminate';
	sub: Subscription;
	constructor(private loading: LoadingService, private cdRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		this.sub = this.loading.loading.subscribe(res => {
			// if (res) {
			// 	setTimeout(() => {
			// 		this.mode = 'indeterminate';
			// 	}, 50);
			// } else {
			// 	this.mode = 'buffer';
			// }
			if(res > 0) {
				this.load = true;
			} else {
				this.load = false;
			}
			this.cdRef.detectChanges();
		});
	}
	
	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
