import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
	providedIn: 'root'
})
export class ExcelService {

	constructor(private http: HttpClient) { }

	public exportCurrentQuotes() {
		return this.http.get(environment.api + 'quotes/currentQuotes/export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportQuoteHistory() {
		return this.http.get(environment.api + 'quotes/quoteHistory/export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportCurrentOrder() {
		return this.http.get(environment.api + 'orders/currentOrders/export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportOrderHistory() {
		return this.http.get(environment.api + 'orders/orderHistory/export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportAsExcelFile(json: any[], excelFileName: string): void {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
			type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
	}

	public exportCurrentTasks() {
		return this.http.get(environment.api + 'tasks/currentTasks/export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportTaskHistory() {
		return this.http.get(environment.api + 'tasks/taskHistory/export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportCurrentComplaints() {
		return this.http.get(environment.api + 'complaints/currentComplaints/Export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportComplaintHistory() {
		return this.http.get(environment.api + 'complaints/complaintsHistory/Export').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

}