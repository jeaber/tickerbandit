export const fundamentalsColumns: { [key: string]: { name: string, pipe: string, default: boolean } } = {
	"industry": { name: 'Industry', pipe: '', default: true },
	"sector": { name: 'Sector', pipe: '', default: true },
	"year_founded": { name: 'Founded', pipe: '', default: true },

	"volume": { name: 'Vol', pipe: 'number:hr', default: false },
	"average_volume": { name: 'Avg Vol', pipe: 'number:hr', default: false },
	"average_volume_2_weeks": { name: 'Avg 2Wk Vol', pipe: 'number:hr', default: true },

	"dividend_yield": { name: 'Div Yeild', pipe: 'percent', default: true },

	"high": { name: 'High', pipe: 'currency', default: false },
	"high_52_weeks": { name: '52Wk High', pipe: 'currency', default: true },
	"low": { name: 'Low', pipe: 'currency', default: false },
	"low_52_weeks": { name: '52Wk Low', pipe: 'currency', default: true },

	"market_cap": { name: 'Mkt Cap', pipe: 'number:hr', default: true },
	"num_employees": { name: '# of Employees', pipe: 'number:hr', default: true },
	"open": { name: 'Open', pipe: 'currency', default: true },
	"pe_ratio": { name: 'P/E Ratio', pipe: 'number', default: true },
	"pb_ratio": { name: 'PB Ratio', pipe: 'number', default: true },
	// "shares_outstanding": { name: 'Founded', pipe: '', default: true },
	// "updated": { name: 'Founded', pipe: '', default: true },
	// "float": { name: 'Founded', pipe: '', default: true },
	// "headquarters_city": { name: 'Founded', pipe: '', default: true },
	// "headquarters_state": { name: 'Founded', pipe: '', default: true },
	// "ceo": { name: 'CEO', pipe: '', default: true },
	// "description": { name: 'Description', pipe: '', default: true },
};
export const quoteColumns: { [key: string]: { custom?: boolean, name: string, pipe: string, default: boolean } } = {
	ask_price: { name: 'Ask', pipe: 'currency', default: true }, // Float number in a String, e.g. '735.7800'
	// ask_size: { name: 'Ask Size', pipe: 'number:hr', default: false }, // Integer
	bid_price: { name: 'Bid', pipe: 'currency', default: true }, // Float number in a String, e.g. '731.5000'
	// bid_size: { name: 'Bid Size', pipe: 'number:hr', default: false }, // Integer
	last_trade_price: { name: 'Last Price', pipe: 'currency', default: true }, // Float number in a String, e.g. '726.3900'
	last_extended_hours_trade_price: { name: 'Last Extended Hours Price', pipe: 'currency', default: false },
	previous_close: { name: 'Previous Close', pipe: 'currency', default: true }, // Float number in a String, e.g. '743.6200'
	adjusted_previous_close: { name: 'Adjusted Prev Close', pipe: 'currency', default: false }, // Float number in a String, e.g. '743.6200'
	previous_close_date: { name: 'Previous Close Date', pipe: 'date', default: false }, // YYYY-MM-DD e.g. '2016-01-06'
};
export const positionColumns: { [key: string]: { custom?: boolean, name: string, pipe: string, default: boolean } } = {
	average_buy_price: { name: 'Avg Cost', pipe: 'currency', default: true }, // "39.2200"
	intraday_average_buy_price: { name: 'Intraday Avg Cost', pipe: 'currency', default: false }, // "0.0000"
	intraday_quantity: { name: 'Intraday Qty', pipe: 'number', default: false }, // "0.0000"
	pending_average_buy_price: { name: 'Pending Avg Buy Price', pipe: 'currency', default: false }, // "39.2200"
	quantity: { name: 'Quanity', pipe: 'number', default: true }, // "10.0000"
	shares_held_for_buys: { name: 'Qty Held For Buys', pipe: 'number', default: false }, // "0.0000"
	shares_held_for_sells: { name: 'Qty Held For Sells', pipe: 'number', default: false }, // "0.0000"
	shares_held_for_stock_grants: { name: 'Qty Held For Stock Grants', pipe: 'number', default: false }, // "0.0000"
	shares_pending_from_options_events: { name: 'Ask', pipe: 'currency', default: false }, // "0.0000"
	// updated_at: { name: 'Ask', pipe: 'currency', default: true }, // "2019-03-28T15:52:05.199136Z"
	// url: { name: 'Ask', pipe: 'currency', default: true },
	// shares_held_for_options_collateral: { name: 'Ask', pipe: 'currency', default: true }, // "0.0000"
	// shares_held_for_options_events: { name: 'Ask', pipe: 'currency', default: true }, // "0.0000"
	total_value: { custom: true, name: 'Total Value', pipe: 'currency', default: true },
	total_change: { custom: true, name: 'Total Change', pipe: 'currency', default: true },
};
export const orderColumns: { [key: string]: { custom?: boolean, name: string, pipe: string, default: boolean } } = {
	"updated_at": { name: 'Order Updated', pipe: 'date', default: false }, // "39.2200"
	"created_at": { name: 'Order Created', pipe: 'date', default: true }, // "0.0000"
	"state": { name: 'Order State', pipe: '', default: true }, // "39.2200"
	"order_quantity": { name: 'Order Qty', pipe: 'number', default: true }, // "0.0000"
	"price": { name: 'Order Price', pipe: 'currency', default: true }, // "0.0000"
	"stop_price": { name: 'Stop Price', pipe: 'currency', default: false }, // "39.2200"
	"time_in_force": { name: 'Order Time', pipe: '', default: true }, // "0.0000"
	"side": { name: 'Side', pipe: '', default: true }, // "39.2200"
	"type": { name: 'Order Type', pipe: '', default: true }, // "0.0000"
	"trigger": { name: 'Order Trigger', pipe: '', default: true }, // "10.0000"
	"average_price": { name: 'Average Cost', pipe: 'currency', default: true }, // "0.0000"

	// "cancel": { name: 'Qty Held For Stock Grants', pipe: 'number', default: false }, // "0.0000"
	// "ref_id": { name: 'Quanity', pipe: 'number', default: true }, // "10.0000"
	// "fees": { name: 'Qty Held For Sells', pipe: 'number', default: false }, // "0.0000"
	// "response_category": { name: 'Ask', pipe: 'currency', default: false }, // "0.0000"
	// "id": { custom: true, name: 'Total Value', pipe: 'currency', default: true },
	// "cumulative_quantity": { custom: true, name: 'Total Change', pipe: 'currency', default: true },
	// "reject_reason": { name: 'Intraday Avg Cost', pipe: 'currency', default: false }, // "0.0000"
	// "override_dtbp_checks": { name: 'Qty Held For Buys', pipe: 'number', default: false }, // "0.0000"
	// "last_transaction_at": { name: 'Qty Held For Stock Grants', pipe: 'number', default: false }, // "0.0000"
	// "executions": { custom: true, name: 'Total Value', pipe: 'currency', default: true },
	// "extended_hours": { custom: true, name: 'Total Change', pipe: 'currency', default: true },
	// "account": { name: 'Avg Cost', pipe: 'currency', default: true }, // "39.2200"
	// "override_day_trade_checks": { name: 'Quanity', pipe: 'number', default: true }, // "10.0000"
};
