export interface Instrument {
	min_tick_size: null;
	splits: string; // 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/splits/',
	margin_initial_ratio: string; // '0.5000',
	url: string; // 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/',
	quote: string; // 'https://api.robinhood.com/quotes/AAPL/',
	symbol: string; // 'AAPL',
	bloomberg_unique: string; // 'EQ0010169500001000',
	list_date: string; // '1990-01-02',
	fundamentals: string; // 'https://api.robinhood.com/fundamentals/AAPL/',
	state: string; // 'active',
	day_trade_ratio: string; // '0.2500',
	tradeable: boolean;
	maintenance_ratio: string; // '0.2500',
	id: string; // '450dfc6d-5510-4d40-abfb-f633b7d9be3e',
	market: {
		"website": string; // "www.nasdaq.com",
		"city": string; // "New York",
		"name": string; // "NASDAQ - All Markets",
		"url": string; // "https:\/\/api.robinhood.com\/markets\/XNAS\/",
		"country": string; // "United States of America",
		"todays_hours": string; // "https:\/\/api.robinhood.com\/markets\/XNAS\/hours\/2019-04-10\/",
		"operating_mic": string; // "XNAS",
		"acronym": string; //  "NASDAQ",
		"timezone": string; //  "US\/Eastern",
		"mic": string; // "XNAS"
	}; // 'https://api.robinhood.com/markets/XNAS/',
	name: string; // 'Apple Inc. - Common Stock'
	updated_at?: Date;
}
