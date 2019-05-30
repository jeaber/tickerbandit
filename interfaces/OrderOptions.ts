export interface OrderOptions {
	// account: string; // URL	Account to make this order with	N/A	Yes
	instrument: {
		url: string; // URL	Instrument URL of the security you're attempting to buy or sell	N/A	Yes
		symbol: string;
	}; // String	The ticker symbol of the security you're attempting to buy or sell	N/A	Yes
	type: 'market' | 'limit'; // String	Order type: market or limit	N / A	Yes
	time: 'gfd' | 'gtc' | ' ioc' | 'opg'; // String	gfd, gtc, ioc, or opg	N / A	Yes
	trigger: 'immediate' | 'stop'; // String	immediate or stop	N / A	Yes
	bid_price: number; // Float	The price you're willing to accept in a sell or pay in a buy	N/A	Yes
	stop_price?: number; // Float	The price at which an order with a stop trigger converts	N / A	Only when trigger equals stop
	quantity: number; // Int	Number of shares you would like to buy or sell	N / A	Yes
	side: 'buy' | 'sell'; // String	buy or sell	N / A	Yes

	/* 	client_id?: string; // String	Only available for OAuth applications	N / A	No
	extended_hours?: boolean; // Boolean	Would / Should order execute when exchanges are closed	N / A	No
	override_day_trade_checks?: boolean; // Boolean		N / A	No
	override_dtbp_checks?: boolean; // Boolean		N / A	No */
}
