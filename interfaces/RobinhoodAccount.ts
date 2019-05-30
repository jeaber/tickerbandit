import { Portfolio } from './Portfolio';

export interface RobinhoodAccount {
	updated: Date;
	account_number: string;
	buying_power: number;
	cash: number;
	cash_available_for_withdrawal: number;
	cash_balances: number;
	cash_held_for_orders: number;
	created_at: string;
	deactivated: string;
	deposit_halted: string;
	instant_eligibility: {};
	margin_balances: {
		cash: number; // "-5948.3300"
		cash_available_for_withdrawal: number; // "51.6700"
		cash_held_for_dividends: number; // "0.0000"
		cash_held_for_nummus_restrictions: number; // "0.0000"
		cash_held_for_options_collateral: number; // "0.0000"
		cash_held_for_orders: number; // "0.0000"
		cash_held_for_restrictions: number; // "0.0000"
		cash_pending_from_options_events: number; // "0.0000"
		created_at: string; // "2017-04-12T20:22:22.873514Z"
		day_trade_buying_power: number; // "3550.2425"
		day_trade_buying_power_held_for_orders: number; // "0.0000"
		day_trade_ratio: number; // "0.25"
		day_trades_protection: boolean;
		gold_equity_requirement: number; // "6000.0000"
		margin_limit: number; // "6000.0000"
		marked_pattern_day_trader_date: string; // null
		outstanding_interest: number; // "0.0000"
		overnight_buying_power: number; // "3550.2425"
		overnight_buying_power_held_for_orders: number; // "0.0000"
		overnight_ratio: number; // "0.50"
		sma: number; // "0"
		start_of_day_dtbp: number; // "3550.2425"
		start_of_day_overnight_buying_power: number; // "3550.2425"
		unallocated_margin_cash: number; // "51.6700"
		uncleared_deposits: number; // "0.0000"
		uncleared_nummus_deposits: number; // "0.0000"
		unsettled_debit: number; // "0.0000"
		unsettled_funds: number; // "0.0000"
		updated_at: string; // "2019-04-16T19:45:31.019281Z
	};
	max_ach_early_access_amount: string;
	only_position_closing_trades: string;
	portfolio: Portfolio;
	positions: string;
	sma: string;
	sma_held_for_orders: string;
	sweep_enabled: boolean;
	type: string;
	uncleared_deposits: string;
	unsettled_funds: string;
	updated_at: string;
	url: string;
	user: string;
	withdrawal_halted: boolean;
}
