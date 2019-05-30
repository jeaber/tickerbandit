import { Quote, Instrument, StockInterface } from '../../interfaces';
import { Historicals } from 'interfaces/Historicals';
import { Fundamentals } from 'interfaces/Fundamentals';
import { NasdaqDividend, Dividend } from 'interfaces/Dividend';
import Stock from '../models/Stock';

export function getStockFromDatabase(symbol: string): Promise<StockInterface> {
	if (!symbol) return;
	symbol = symbol.toUpperCase();
	return new Promise((resolve) => {
		const query = Stock.find({ symbol }, { _id: 0 }).limit(1);
		query.exec((err, stocks) => {
			if (err) console.error('getstock err', err);
			const stock = stocks[0];
			resolve(stock);
		});
	});
}

export function updateQuote(quote: Quote): Promise<StockInterface> {
	if (quote && Object.keys(quote).length > 1)
		return new Promise((resolve) => {
			Stock.findOneAndUpdate(
				{ symbol: quote.symbol },
				{
					symbol: quote.symbol,
					quote: quote,
					updated: new Date()
				},
				{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
					if (stock)
						resolve(getStockFromDatabase(quote.symbol));
					else
						resolve();
					console.log('MDB Quote Updated', Object.keys(stock.quote).length);
				});
		});
}
export function updateInstrument(instrument: Instrument): Promise<StockInterface> {
	if (instrument && Object.keys(instrument).length > 1)
		return new Promise((resolve) => {
			Stock.findOneAndUpdate(
				{ symbol: instrument.symbol },
				{
					symbol: instrument.symbol,
					instrument
				},
				{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
					if (stock)
						resolve(getStockFromDatabase(stock.symbol));
					else
						resolve();
					console.log('MDB Instrument updated', Object.keys(stock.instrument).length);
				});
		});
}
export function updateFundamentals(symbol: string, fundamentals: Fundamentals): Promise<StockInterface> {
	try {
		// console.log('save fundamentals', symbol, fundamentals);
		if (fundamentals && Object.keys(fundamentals).length > 1)
			return new Promise((resolve) => {
				Stock.findOneAndUpdate(
					{ symbol },
					{
						symbol,
						fundamentals
					},
					{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
						if (stock)
							resolve(getStockFromDatabase(stock.symbol));
						else
							resolve();
						console.log('MDB fundamentals updated', symbol, Object.keys(stock.fundamentals).length);
					});
			});
	} catch (e) {
		console.error('updateFundamentals err', e);
	}
}
export function updateHistoricals(span: string, historicals: Historicals): Promise<StockInterface> {
	try {
		if (historicals && Object.keys(historicals).length > 1)
			return new Promise((resolve) => {
				Stock.findOneAndUpdate(
					{ symbol: historicals.symbol },
					{
						symbol: historicals.symbol,
						[span]: { updated: Date.now(), data: historicals },
					},
					{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
						if (stock)
							resolve(getStockFromDatabase(stock.symbol));
						else
							resolve();
						console.log('MDB  updated', span, Object.keys(stock[span]).length);
					});
			});
	} catch (e) {
		console.error('updateHistoricals err', e);
	}
}
export function updateDividends(symbol: string, dividends: Dividend): Promise<StockInterface> {
	try {
		return new Promise((resolve, reject) => {
			if (dividends && Object.keys(dividends).length > 1) {
				Stock.findOneAndUpdate(
					{ symbol },
					{ symbol, dividends },
					{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
						console.log('MDB  dividends', symbol, Object.keys(dividends.data).length);
						if (stock)
							resolve(getStockFromDatabase(stock.symbol));
						else
							resolve();
					});
			} else
				reject();
		});
	} catch (e) {
		console.error('updateDividends err', e);
	}
}
export function updateMarketWatchEPS(symbol: string, eps: { year: number, eps: number }[]): Promise<StockInterface> {
	try {
		return new Promise((resolve, reject) => {
			if (eps) {
				Stock.findOneAndUpdate(
					{ symbol },
					{ eps: { updated_at: new Date(), data: eps } },
					{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
						if (err) {
							console.log(err, 'mdb err mw');
							reject();
						} else {
							console.log('MDB  EPS updated', symbol, Object.keys(stock.eps.data).length);
							if (stock)
								resolve(getStockFromDatabase(stock.symbol));
							else
								resolve();
						}
					});
			} else {
				console.log('rejecting mw save');
				reject();
			}
		});
	} catch (e) {
		console.error('save mweps err', e);
	}
}
export function updateFinvizFinancials(symbol: string, financials: {}): Promise<StockInterface> {
	try {
		return new Promise((resolve, reject) => {
			if (financials) {
				Stock.findOneAndUpdate(
					{ symbol },
					{ financials },
					{ upsert: true, new: true, runValidators: true }, function (err, stock: StockInterface) {
						if (err) {
							console.log(err, 'mdb err FinvizFinancials');
							reject();
						} else {
							console.log('financials updated', symbol, Object.keys(stock.financials).length);
							if (stock)
								resolve(getStockFromDatabase(stock.symbol));
							else
								resolve();
						}
					});
			} else {
				console.log('rejecting FinvizFinancials save');
				reject();
			}
		});
	} catch (e) {
		console.error('save FinvizFinancials err', e);
	}
}
