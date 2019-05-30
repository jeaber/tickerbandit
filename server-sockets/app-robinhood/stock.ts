import { Quote, Instrument, StockInterface } from 'interfaces';
import db from './../app-mongo-operations';
import { Historicals } from 'interfaces/Historicals';
import { Fundamentals } from 'interfaces/Fundamentals';
import * as rp from 'request-promise';
const axios = require('axios');

export function fetchQuote(Robinhood, symbol): Promise<StockInterface> {
	try {
		return new Promise((resolve) => {
			if (symbol) {
				Robinhood.quote_data(symbol, function (err, response, body) {
					if (err) {
						console.error(err);
						resolve();
					} else {
						if (body) {
							const quote: Quote = body.results && body.results[0];
							if (body['detail']) {
								console.log('INVALID TOKEN [QUOTE]', Robinhood);
							}
							if (quote) {
								console.log('RH Quote', quote.symbol, Object.keys(quote).length);
								db.updateQuote(quote)
									.then((stock) => resolve(stock));
							}
						} else {
							resolve();
						}
					}
				});
			}
		});
	} catch (e) {
		console.log("E Caught QUOTEs", e);
	}
}
export function fetchInstrument(Robinhood, symbol): Promise<StockInterface> {
	try {
		return new Promise((resolve) => {
			if (symbol && Robinhood) {
				Robinhood.instruments(symbol, function (err, response, body) {
					if (err) {
						console.error(err);
						resolve();
					} else {
						if (body) {
							const instrument: Instrument = body.results ? body.results[0] : undefined;
							if (body['detail']) {
								console.log('INVALID TOKEN [INTRUMENT]', Robinhood);
							}
							if (instrument) {
								instrument.updated_at = new Date();
								axios.get(instrument.market)
									.then((res) => {
										const market = res.data;
										return Object.assign(instrument, { market });
									})
									.then((instrumentWithMarketData: Instrument) => {
										db.updateInstrument(instrumentWithMarketData)
											.then((stock) => resolve(stock));
									});
							} else {
								resolve();
							}
						}
					}
				});
			}
		});
	} catch (e) {
		console.log("E Caught INSTRUMENT", e);
	}
}

export function fetchFundamentals(RH, symbol: string): Promise<StockInterface> {
	try {
		return new Promise((resolve) => {
			if (!RH || !symbol) {
				console.error('NO RH OR TICKER', !!RH, symbol);
				resolve();
				return;
			}
			console.log('FETCH FUNDAMENTALS', symbol);
			RH.fundamentals(symbol, (error, response, body) => {
				if (error) {
					console.error(error);
					resolve();
				} else {
					if (body) {
						const fundamentals: Fundamentals = body;
						if (body['detail']) {
							console.log('INVALID TOKEN [FUNDAMENTALS]', body['detail']);
						}
						if (fundamentals) {
							fundamentals.updated_at = new Date();
							db.updateFundamentals(symbol, fundamentals)
								.then((stock) => resolve(stock));
						}
					}
				}
			});
		});
	} catch (e) {
		console.log("E Caught Fundamentals", e);
	}
}

export function fetchHistoricals(Robinhood, symbol, interval: "5minute" | "10minute", span: "week" | "day"): Promise<StockInterface> {
	try {
		return new Promise((resolve) => {
			Robinhood.historicals(symbol, interval, span, function (err, response, body) {
				if (err) {
					console.error(err);
					resolve();
				} else {
					const historicals: Historicals = body;
					console.log("got historicals", historicals);
					if (historicals) {
						if (historicals['detail']) {
							console.log('INVALID TOKEN [HISTORICALS]', historicals['detail']);
						}
						historicals.historicals = body.historicals.reverse();
						const yearspan = 'historicals_' + historicals.span;
						db.updateHistoricals(yearspan, historicals)
							.then((stock) => resolve(stock));
					} else
						resolve();
				}
			});
		});
	} catch (e) {
		console.log("E Caught Historicals", e);
	}
}

export function addInstrumentsToData(data: any[]) {
	try {
		return new Promise((resolve) => {
			const promises = data.map(obj => rp({ uri: obj.instrument, json: true }));
			Promise.all(promises)
				.then((instruments: Instrument[]) => {
					data.forEach((obj, i) => {
						obj = Object.assign(obj, { instrument: instruments[i] });
					});
					return data;
				})
				.then((datawithinstruments: any[]) => {
					const marketpromises = datawithinstruments.map(obj => rp({ uri: obj.instrument.market, json: true }));
					Promise.all(marketpromises)
						.then((markets) => {
							datawithinstruments.forEach((obj, i) => {
								obj.instrument = Object.assign(obj.instrument, { market: markets[i] });
							});
							resolve(datawithinstruments);
						});
				});
		});
	} catch (e) {
		console.log("E caught SYMBOLSFROMURL", e);
	}
}
export function symbolsFromUrls(urls: string[]) {
	try {
		return new Promise((resolve) => {
			const promises = urls.map(url => rp({ uri: url, json: true }));
			Promise.all(promises)
				.then((instruments: Instrument[]) => {
					const symbols = instruments.map(instrument => instrument.symbol);
					resolve(symbols);
				});
		});
	} catch (e) {
		console.log("E caught SYMBOLSFROMURL", e);
	}
}
