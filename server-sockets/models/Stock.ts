const mongoose = require("mongoose");
const stockSchema = mongoose.Schema({
	symbol: { type: String, uppercase: true, unique: true },
	tradable: { type: Boolean },
	dividends: {
		updated_at: { type: Date, default: Date.now },
		nextDividend: {
			predicted: { type: Boolean },
			date: { type: Date },
			payout: [],
		},
		data: [],
		interval: { type: String }
	},
	eps: {
		updated_at: { type: Date },
		data: [{ year: String, eps: Number }]
	},
	fundamentals: {
		average_volume: { type: Number }, // "11251839.454200"
		average_volume_2_weeks: { type: Number }, // "20985540.300000"
		ceo: { type: String }, // "Giovanni Caforio"
		description: { type: String }, // "Bristol-Myers Squibb Co. engages in the discovery, development, liale
		dividend_yield: { type: Number }, // "3.097400"
		float: { type: Number }, // "1630610000.000000"
		headquarters_city: { type: String }, // "New York"
		headquarters_state: { type: String }, // "New York"
		high: { type: Number }, // "46.320000"
		high_52_weeks: { type: Number }, // "63.690000"
		industry: { type: String }, // "Pharmaceuticals Major"
		instrument: { type: String }, // "https://api.robinhood.com/instruments/781bc8c8-1649-40d1-8f15-417da0b8f691/"
		low: { type: Number }, // "45.710000"
		low_52_weeks: { type: Number }, // "44.300000"
		market_cap: { type: Number }, // "74671520000.000000"
		num_employees: { type: Number }, // 23300
		open: { type: Number }, // "46.035000"
		pb_ratio: { type: Number }, // "5.321900"
		pe_ratio: { type: Number }, // "15.248464"
		sector: { type: String }, // "Health Technology"
		shares_outstanding: { type: Number }, // "1624000000.000000"
		updated_at: { type: Date }, // "2019-04-10T16:52:51.027Z"
		volume: { type: Number }, // "3337580.000000"
		year_founded: { type: Number }, // 1933
	},
	historicals_year: {
		updated: { type: Date, default: Date.now },
		data: {
			quote: { type: String },
			symbol: { type: String },
			interval: { type: String },
			span: { type: String },
			bounds: { type: String },
			previous_close: { type: String },
			historicals: []
		}
	},
	historicals_5year: {
		updated: { type: Date, default: Date.now },
		data: {
			quote: { type: String },
			symbol: { type: String },
			interval: { type: String },
			span: { type: String },
			bounds: { type: String },
			previous_close: { type: String },
			historicals: []
		}
	},
	instrument: {
		min_tick_size: { type: String },
		splits: { type: String },
		margin_initial_ratio: { type: String },
		url: { type: String },
		quote: { type: String },
		symbol: { type: String },
		bloomberg_unique: { type: String },
		list_date: { type: String },
		fundamentals: { type: String },
		state: { type: String },
		day_trade_ratio: { type: String },
		tradeable: { type: Boolean },
		maintenance_ratio: { type: String },
		id: { type: String },
		market: {},
		name: { type: String },
		updated_at: { type: Date }
	},
	ipo: {
		symbol: { type: String },
		name: { type: String },
		industry: { type: String },
		offer_date: { type: String },
		shares: { type: String },
		offer_price: { type: String },
		first_close: { type: String },
		current_price: { type: String },
		return: { type: String }
	},
	quote: {
		ask_price: { type: Number },
		ask_size: { type: Number },
		bid_price: { type: Number },
		bid_size: { type: Number },
		last_trade_price: { type: Number },
		last_extended_hours_trade_price: { type: Number },
		previous_close: { type: Number },
		adjusted_previous_close: { type: Number },
		previous_close_date: { type: String },
		symbol: { type: String },
		trading_halted: { type: Boolean },
		has_traded: { type: Boolean },
		updated_at: { type: Date },
		updated: { type: Date, default: Date.now }
	},
	financials: {
		'52w_high_pct': { type: Number },
		'52w_low_pct': { type: Number },
		'52w_range': { type: String },
		atr: { type: Number },
		avg_volume: { type: String },
		beta: { type: Number },
		booksh: { type: Number },
		cashsh: { type: Number },
		change_pct: { type: Number },
		current_ratio: { type: Number },
		debteq: { type: Number },
		dividend: { type: Number },
		dividend_pct: { type: Number },
		earnings: { type: String },
		employees: { type: Number },
		eps_next_5y_pct: { type: Number },
		eps_next_q: { type: Number },
		eps_next_y: { type: Number },
		eps_next_y_pct: { type: Number },
		eps_past_5y_pct: { type: Number },
		eps_qq_pct: { type: Number },
		eps_this_y_pct: { type: Number },
		eps_ttm: { type: Number },
		forward_pe: { type: Number },
		gross_margin_pct: { type: Number },
		income: { type: String },
		index: { type: String },
		insider_own_pct: { type: Number },
		insider_trans_pct: { type: Number },
		inst_own_pct: { type: Number },
		inst_trans_pct: { type: Number },
		lt_debteq: { type: Number },
		market_cap: { type: String },
		oper_margin_pct: { type: Number },
		optionable: { type: String },
		payout_pct: { type: Number },
		pb: { type: Number },
		pc: { type: Number },
		pe: { type: Number },
		peg: { type: Number },
		perf_half_y_pct: { type: Number },
		perf_month_pct: { type: Number },
		perf_quarter_pct: { type: Number },
		perf_week_pct: { type: Number },
		perf_year_pct: { type: Number },
		perf_ytd_pct: { type: Number },
		pfcf: { type: Number },
		prev_close: { type: Number },
		price: { type: Number },
		profit_margin_pct: { type: Number },
		ps: { type: Number },
		quick_ratio: { type: Number },
		recom: { type: Number },
		rel_volume: { type: Number },
		roa_pct: { type: Number },
		roe_pct: { type: Number },
		roi_pct: { type: Number },
		rsi_14: { type: Number },
		sales: { type: String },
		sales_past_5y_pct: { type: Number },
		sales_qq_pct: { type: Number },
		short_float_pct: { type: Number },
		short_ratio: { type: Number },
		shortable: { type: String },
		shs_float: { type: String },
		shs_outstand: { type: String },
		sma20_pct: { type: Number },
		sma50_pct: { type: Number },
		sma200_pct: { type: Number },
		target_price: { type: Number },
		updated_at: { type: Date },
		volatility_pct: { week: { type: Number }, month: { type: Number } },
		volume: { type: Number },
	}
});
const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
