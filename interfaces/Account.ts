import { Order } from './Order';
import { RobinhoodAccount } from './RobinhoodAccount';
import { Portfolio } from './Portfolio';
import { PositionInterface } from './Position';
import { ProfileInterface } from './Profile';

export interface AccountInterface {
	username: string;
	password: string;
	orders: Order[];
	autotrade: boolean;
	buylist: [{
		symbol: string;
		price: number;
		quantity: number;
	}];
	dividends: [{
		date: Date;
		payoutTotal: number;
		symbol: string;
	}];
	profile: ProfileInterface;
	account: RobinhoodAccount;
	positions: PositionInterface[];
	portfolio: Portfolio;
}
