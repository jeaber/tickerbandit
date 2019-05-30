export interface Historicals {
	quote: string; // 'https://api.robinhood.com/quotes/AAPL/',
	symbol: string; // 'AAPL',
	interval: string; // '5minute',
	span: string; // 'week',
	bounds: string; // 'regular';
	previous_close: string; // null;
	historicals: {
		begins_at: Date; // '2016-09-15T13:30:00Z',
		open_price: string; // '113.8300',
		close_price: string; // '114.1700',
		high_price: string; // '114.3500',
		low_price: string; // '113.5600',
		volume: number; // 3828122,
		session: string; // 'reg',
		interpolated: boolean
	}[];
}
