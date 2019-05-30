
import db from '../app-mongo-operations';
import { Order, OrderOptions } from 'interfaces';
import { PositionInterface } from 'interfaces/Position';
import { addInstrumentsToData } from './stock';
import { Portfolio } from './../../interfaces/Portfolio';
import { RobinhoodAccount } from 'interfaces/RobinhoodAccount';
export function fetchAccount(RH): Promise<RobinhoodAccount> {
	try {
		return new Promise((resolve, reject) => {
			RH.accounts((err, response, body) => {
				if (err || !body) {
					console.error('RH accounts ERROR');
					console.error(err);
					reject();
				} else {
					const data: RobinhoodAccount = body.results ? body.results[0] : undefined;
					if (body['detail'] || !data) {
						console.error('INVALID TOKEN [account]', RH);
						reject({ function: "ACCOUNTS", date: new Date(), data: body });
					} else {
						addPortfolioToAccount(RH, data).then((accountWithPortfolio: RobinhoodAccount) => {
							db.updateAccount(RH.username, accountWithPortfolio).then(acc => {
								acc.portfolio.calculated_buying_power = calcBuyingPower(acc);
								console.log('account', RH.username, acc);
								resolve(acc);
							});
						});
					}
				}
			});
		});
	} catch (e) {
		console.error("E Caught ACCOUNTS", e);
	}
}
function calcBuyingPower(accountWithPortfolio: RobinhoodAccount): number {
	if (accountWithPortfolio.portfolio) {
		let buyingPower: number;
		buyingPower = accountWithPortfolio.portfolio.equity
			+ (accountWithPortfolio.margin_balances ? accountWithPortfolio.margin_balances.margin_limit : 0)
			- accountWithPortfolio.portfolio.market_value
			- accountWithPortfolio.margin_balances.cash_held_for_orders;
		return buyingPower;
	}
}
function addPortfolioToAccount(RH, data: RobinhoodAccount): Promise<RobinhoodAccount> {
	try {
		return new Promise((resolve) => {
			RH.url(data.portfolio, (err, response, body) => {
				const portfolio: Portfolio = body;
				const accountWithPortfolio = Object.assign(data, { portfolio });
				resolve(accountWithPortfolio);
			});
		});
	} catch (e) {
		console.log("E caught SYMBOLSFROMURL", e);
	}
}
export function positions(RH): Promise<PositionInterface[]> {
	try {
		return new Promise((resolve, reject) => {
			RH.nonzero_positions((err, response, body: { next: string, previous: string, results: PositionInterface[] }) => {
				if (err || !body) {
					console.error('RH accounts ERROR');
					console.error(err);
					reject();
				} else {
					const data: PositionInterface[] = body.results;
					if (body['detail'] || !data) {
						console.error('INVALID TOKEN [POSitions]', RH);
						reject({ function: "POSITIONS", date: new Date(), data: body });
					} else {
						addInstrumentsToData(data)
							.then((positionsWithInstruments: PositionInterface[]) => {
								db.updatePositions(RH.username, positionsWithInstruments);
								resolve(positionsWithInstruments);
							});
					}
				}
			});
		});
	} catch (e) {
		console.error("E Caught POSitions", e);
	}
}

export function fetchOrders(RH): Promise<Order[]> {
	try {
		return new Promise((resolve, reject) => {
			RH.orders(function (err, response, body) {
				if (err || !body) {
					console.error('RH orders ERROR');
					console.error(err);
					reject();
				} else {
					if (body['detail']) {
						console.error('INVALID TOKEN [ORDERS]', RH);
						reject({ function: "ORDERS", date: new Date(), data: body });
					} else {
						const orders: Order[] = body.results;
						addInstrumentsToData(orders)
							.then((ordersWithInstruments: Order[]) => {
								db.updateOrders(RH.username, ordersWithInstruments);
								resolve(ordersWithInstruments);
							});
					}
				}
			});
		});
	} catch (e) {
		console.error("E Caught ORDERS", e);
	}
}
export function cancel_order(RH, orderToCancel): Promise<boolean> {
	try {
		return new Promise((resolve, reject) => {
			RH.cancel_order(orderToCancel, function (err, response, body) {
				if (err || !body) {
					console.error(err); // { message: 'Order cannot be cancelled.', order: {Order} }
					resolve(false);
				} else {
					console.log("Cancel Order Successful");
					console.log(body);
					resolve(true);
				}
			});
		});
	} catch (e) {
		console.log("E Caught CANCEL ORDER", e);
	}
}
export function place_buy_order(RH, options: OrderOptions): Promise<{ success: boolean, error?: string, order?: Order }> {
	try {
		return new Promise((resolve, reject) => {
			if (options && options.instrument) {
				RH.place_buy_order(options, function (error, response, body) {
					if (error || !body) {
						console.error(error);
						resolve({ success: false, error });
					} else {
						console.log('success', body);
						resolve({ success: true, order: body });
					}
				});
				// });
			}
		});
	} catch (e) {
		console.error("E Caught PLACE BUY", e);
	}
}
export function place_sell_order(RH, options: OrderOptions): Promise<{ success: boolean, error?: string, order?: Order }> {
	try {
		return new Promise((resolve, reject) => {
			if (options && options.instrument) {
				RH.place_sell_order(options, function (error, response, body) {
					if (error || !body) {
						console.error(error);
						resolve({ success: false, error });
					} else {
						console.log("RB SELL", body);
						resolve({ success: true, order: body });
					}
				});
				// });
			}
		});
	} catch (e) {
		console.error("E Caught PLACE SELL", e);
	}
}
export function watchlists(RH) {
	try {
		return new Promise((resolve, reject) => {
			RH.watchlists((error, response, body) => {
				if (error || !body) {
					console.error(error);
					reject();
				} else {
					console.log("RB watchlists", body);
					resolve(body);
				}
			});
		});
	} catch (e) {
		console.error("E Caught WATCHLIST", e);
	}
}
export function refresh(RH, socket, portfoliourl?: string) {
	try {
		// orders(RH, socket);
		// positions(RH, socket);
		// accounts(RH, socket);
		// url(RH, socket, portfoliourl);
	} catch (e) {
		console.error("E Caught REFRESH()", e);
	}
}
