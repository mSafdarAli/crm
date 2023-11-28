export interface APIResponse {
	success: boolean;
	error: boolean;
	message?: string | object;
	token?: string;
	data: null;
	pagination: { total: number, page: number, page_size: number };
}