import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class PaginatorI18n {

	constructor(private readonly translate: TranslateService) { }
	rangLabel1 = "range_page_label_1";
	rangLabel2 = "range_page_label_2";
	getPaginatorIntl(): MatPaginatorIntl {
		const paginatorIntl = new MatPaginatorIntl();
		this.translate.stream(['paginator.items_per_page_label', 'paginator.next_page_label', 'paginator.previous_page_label', 'paginator.first_page_label', 'paginator.last_page_label', 'paginator.range_page_label_1', 'paginator.range_page_label_2']).subscribe(res => {
			paginatorIntl.itemsPerPageLabel = res['paginator.items_per_page_label'];
			paginatorIntl.nextPageLabel = res['paginator.next_page_label'];
			paginatorIntl.previousPageLabel = res['paginator.previous_page_label'];
			paginatorIntl.firstPageLabel = res['paginator.first_page_label'];
			paginatorIntl.lastPageLabel = res['paginator.last_page_label'];
			this.rangLabel1 = res['paginator.range_page_label_1'];
			this.rangLabel2 = res['paginator.range_page_label_2'];
			paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
		})
		return paginatorIntl;
	}

	private getRangeLabel(page: number, pageSize: number, length: number): string {
		if (length === 0 || pageSize === 0) {
			return this.rangLabel1.replace('{{length}}', ''+length);
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
		return this.rangLabel2.replace('{{length}}', '' + length).replace('{{startIndex}}', '' + (startIndex + 1)).replace('{{endIndex}}', '' + endIndex);
	}
}