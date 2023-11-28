import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";

@Injectable({
	providedIn: 'root'
})
export class SortService {
	constructor() { }

	public getSortedData(sort: Sort, col: string[], data: any) {
		const sortedData = data.slice();
		if (!sort.active || sort.direction === '') {
			return sortedData;
		}

		return sortedData.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			if (col.indexOf(sort.active) > -1) {
				const col = sort.active;
				return this.compare(a[col], b[col], isAsc);
			}
			return 0;
			// switch (sort.active) {
			// 	case 'firstName':
			// 	case 'lastName':
			// 		return this.compare(a.lastName, b.lastName, isAsc);
			// 	case 'userName':
			// 		return this.compare(a.userName, b.userName, isAsc);
			// 	case 'contactNumber':
			// 		return this.compare(a.contactNumber, b.contactNumber, isAsc);
			// 	case 'emailAddress':
			// 		return this.compare(a.emailAddress, b.emailAddress, isAsc);
			// 	default:
			// 		return 0;
			// }
		});
	}

	private compare(a: number | string, b: number | string, isAsc: boolean) {
		a = (a === null || a==='')? '1899-12-31 23:59:59' : a;
		b = (b === null || b === '') ? '1899-12-31 23:59:59' : b;
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}
}