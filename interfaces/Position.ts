import { Instrument } from './Instrument';

export interface PositionInterface {
	account: string; // "https://api.robinhood.com/accounts/5SC16997/"
	average_buy_price: string; // "39.2200"
	created_at: string; // "2018-12-17T14:55:44.046292Z"
	instrument: Instrument; // "https://api.robinhood.com/instruments/0a8a072c-e52c-4e41-a2ee-8adbd72217d3/"
	intraday_average_buy_price: string; // "0.0000"
	intraday_quantity: string; // "0.0000"
	pending_average_buy_price: string; // "39.2200"
	quantity: string; // "10.0000"
	shares_held_for_buys: string; // "0.0000"
	shares_held_for_options_collateral: string; // "0.0000"
	shares_held_for_options_events: string; // "0.0000"
	shares_held_for_sells: string; // "0.0000"
	shares_held_for_stock_grants: string; // "0.0000"
	shares_pending_from_options_events: string; // "0.0000"
	updated_at: string; // "2019-03-28T15:52:05.199136Z"
	url: string; // "https://api.robinhood.com/positions/5SC16997/0a8a072c-e52c-4e41-a2ee-8adbd72217d3/"
	total_value?: number;
	total_change_value?: number;
	total_change?: number;
}
