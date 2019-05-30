import { Historicals } from './Historicals';
import { Instrument } from './Instrument';
import { Quote } from './Quote';
import { Fundamentals } from './Fundamentals';
import { Dividend } from './Dividend';
import { PositionInterface } from './Position';
import { Order } from './Order';
import { Financials } from './Financials';

export interface StockInterface {
	symbol: string;
	tradable: boolean;
	dividends: Dividend;
	fundamentals: Fundamentals;
	historicals_year: {
		updated: Date;
		data: Historicals
	};
	historicals_5year: {
		updated: Date;
		data: Historicals
	};
	eps: {
		updated_at: Date;
		data: { year: string, eps: number }[];
	};
	instrument: Instrument;
	ipo: {
		symbol: string;
		name: string;
		industry: string;
		offer_date: string;
		shares: string;
		offer_price: string;
		first_close: string;
		current_price: string;
		return: { type: String }
	};
	quote: Quote;
	financials?: Financials;
	position?: PositionInterface;
	order?: Order;
	activeOrders?: Order[];
	scores?: {
		risk?: {
			score: number,
			data: {
				yearscore: number;
				pescore: number;
				volumescore: number;
				divscore: number;
				epsscore: number;
				employeescore: number;
				mktcapscore: number;
			}
		}
	};
}
