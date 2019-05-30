const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
	username: { type: String, unique: true },
	password: { type: String },
	orders: [],
	autotrade: { type: Boolean },
	buylist: [{
		symbol: { type: String, uppercase: true, unique: true },
		price: { type: Number },
		quantity: { type: Number },
	}],
	dividends: [{
		date: { type: Date, default: Date.now },
		payoutTotal: { type: Number },
		symbol: { type: String }
	}],
	profile: {
		updated: { type: Date, default: Date.now },
		annual_income: { type: String },
		investment_experience: { type: String },
		updated_at: { type: String },
		risk_tolerance: { type: String },
		total_net_worth: { type: String },
		liquidity_needs: { type: String },
		investment_objective: { type: String },
		source_of_funds: { type: String },
		user: { type: String },
		suitability_verified: { type: Boolean },
		tax_bracket: { type: String },
		time_horizon: { type: String },
		liquid_net_worth: { type: String },
	},
	account: {
		updated: { type: Date, default: Date.now },
		account_number: { type: String },
		buying_power: { type: Number },
		cash: { type: Number },
		cash_available_for_withdrawal: { type: Number },
		cash_balances: { type: Number },
		cash_held_for_orders: { type: Number },
		created_at: { type: String },
		deactivated: { type: String },
		deposit_halted: { type: String },
		instant_eligibility: {},

		max_ach_early_access_amount: { type: String },
		only_position_closing_trades: { type: String },
		positions: { type: String },
		sma: { type: String },
		sma_held_for_orders: { type: String },
		sweep_enabled: { type: Boolean },
		type: { type: String },
		uncleared_deposits: { type: Number },
		unsettled_funds: { type: Number },
		updated_at: { type: String },
		url: { type: String },
		user: { type: String },
		withdrawal_halted: { type: Boolean },
		margin_balances: {
			cash: { type: Number }, // "-5948.3300"
			cash_available_for_withdrawal: { type: Number }, // "51.6700"
			cash_held_for_dividends: { type: Number }, // "0.0000"
			cash_held_for_nummus_restrictions: { type: Number }, // "0.0000"
			cash_held_for_options_collateral: { type: Number }, // "0.0000"
			cash_held_for_orders: { type: Number }, // "0.0000"
			cash_held_for_restrictions: { type: Number }, // "0.0000"
			cash_pending_from_options_events: { type: Number }, // "0.0000"
			created_at: { type: String }, // "2017-04-12T20:22:22.873514Z"
			day_trade_buying_power: { type: Number }, // "3550.2425"
			day_trade_buying_power_held_for_orders: { type: Number }, // "0.0000"
			day_trade_ratio: { type: Number }, // "0.25"
			day_trades_protection: { type: Boolean },
			gold_equity_requirement: { type: Number }, // "6000.0000"
			margin_limit: { type: Number }, // "6000.0000"
			marked_pattern_day_trader_date: { type: String }, // null
			outstanding_interest: { type: Number }, // "0.0000"
			overnight_buying_power: { type: Number }, // "3550.2425"
			overnight_buying_power_held_for_orders: { type: Number }, // "0.0000"
			overnight_ratio: { type: Number }, // "0.50"
			sma: { type: Number }, // "0"
			start_of_day_dtbp: { type: Number }, // "3550.2425"
			start_of_day_overnight_buying_power: { type: Number }, // "3550.2425"
			unallocated_margin_cash: { type: Number }, // "51.6700"
			uncleared_deposits: { type: Number }, // "0.0000"
			uncleared_nummus_deposits: { type: Number }, // "0.0000"
			unsettled_debit: { type: Number }, // "0.0000"
			unsettled_funds: { type: Number }, // "0.0000"
			updated_at: { type: String }, // "2019-04-16T19:45:31.019281Z
		},
		portfolio: {
			updated: { type: Date, default: Date.now },
			account: { type: String },
			adjusted_equity_previous_close: { type: Number },
			equity: { type: Number },
			equity_previous_close: { type: Number },
			excess_maintenance: { type: Number },
			excess_maintenance_with_uncleared_deposits: { type: Number },
			excess_margin: { type: Number },
			excess_margin_with_uncleared_deposits: { type: Number },
			extended_hours_equity: { type: Number },
			extended_hours_market_value: { type: Number },
			last_core_equity: { type: Number },
			last_core_market_value: { type: Number },
			market_value: { type: Number },
			start_date: { type: String },
			unwithdrawable_deposits: { type: Number },
			unwithdrawable_grants: { type: Number },
			url: { type: String },
			withdrawable_amount: { type: Number },
			calculated_buying_power: { type: Number },
		},
	},
	positions: [],

});
const Account = mongoose.model('Account', accountSchema);
export default Account;
