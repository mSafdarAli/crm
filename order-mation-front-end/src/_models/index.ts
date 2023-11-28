export interface User {
	nameid: string;
	unique_name: string;
	ClientName : string;
	ClientId : string;
	UserName : string;
}
export interface Role {
	RoleName : string
}
export interface lineGraph {
	id: string,
	month: string,
	target: string,
	totalOrders: string,
	year: string
}
export interface barGraph {
	repId: number,
	repName: string,
	totalSelling: number,
	target: number,
}
export interface dashboardData {
	invoicedQty: string,
	ordersMTD: string,
	ordersMTDValue: string,
	quoteConversions: string,
	quotesMTD: string,
	quotesMTDValue: string,
	salesToTarget: string,
	target: string,
	totalInvoiced: string,
	wip: string,
	wipQty: string
}
export interface User {
	id: string,
	userName: string,
	firstName: string,
	lastName: string,
	emailAddress: string,
	code: string,
	title: string,
	contactNumber: string,
	telephoneNumber: string,
	active: true,
	userRoles: Role[]
}



declare module menuData {

	export interface MenuItem {
		id: number;
		item: string;
		roleAllowed: boolean;
	}

	export interface MenuGroup {
		group: string;
		menuItems: MenuItem[];
	}

	export interface Datum {
		tab: string;
		menuGroups: MenuGroup[];
	}

	export interface RootObject {
		statusCode: number;
		statusDescription: string;
		data: Datum[];
	}

}

