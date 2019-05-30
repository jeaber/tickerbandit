export interface Quote {
	ask_price: number; // Float number in a String, e.g. '735.7800'
	ask_size: number; // Integer
	bid_price: number; // Float number in a String, e.g. '731.5000'
	bid_size: number; // Integer
	last_trade_price: number; // Float number in a String, e.g. '726.3900'
	last_extended_hours_trade_price: number; // Float number in a String, e.g. '735.7500'
	previous_close: number; // Float number in a String, e.g. '743.6200'
	adjusted_previous_close: number; // Float number in a String, e.g. '743.6200'
	previous_close_date: number; // YYYY-MM-DD e.g. '2016-01-06'
	symbol: string; // e.g. 'AAPL'
	trading_halted: boolean;
	has_traded: boolean;
	updated_at: string; // YYYY-MM-DDTHH:MM:SS e.g. '2016-01-07T21:00:00Z'
}
