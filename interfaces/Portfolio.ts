export interface Portfolio {
	updated: Date;
	account: string;
	adjusted_equity_previous_close: number;
	equity: number;
	equity_previous_close: number;
	excess_maintenance: number;
	excess_maintenance_with_uncleared_deposits: number;
	excess_margin: number;
	excess_margin_with_uncleared_deposits: number;
	extended_hours_equity: number;
	extended_hours_market_value: number;
	last_core_equity: number;
	last_core_market_value: number;
	market_value: number;
	start_date: string;
	unwithdrawable_deposits: string;
	unwithdrawable_grants: string;
	url: string;
	withdrawable_amount: number;
	calculated_buying_power?: number;
}
