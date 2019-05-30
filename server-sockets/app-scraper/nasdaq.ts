import { NasdaqDividend, Dividend } from '../../interfaces/Dividend';
import { updateDividends } from '../app-mongo-operations/stock';

import * as cheerio from 'cheerio';
import { StockInterface } from 'interfaces';
const axios = require('axios');

export function fetchDividendHistory(symbol: string): Promise<StockInterface> {
	try {
		return new Promise((resolve) => {
			if (!symbol) { resolve(); return; }
			const url = `https://www.nasdaq.com/symbol/${symbol}/dividend-history`;
			// const url = "http://www.nasdaq.com/symbol/" + symbol + "/dividend-history";
			console.log(`fetching ${symbol} from ${url}`);
			axios.get(url)
				.then(response => {
					const $ = cheerio.load(response.data);
					return $;
				}, () => resolve())
				.then(($: CheerioStatic) => {
					const dividends: NasdaqDividend[] = [];
					let counter = 0;
					let item = $('#quotes_content_left_dividendhistoryGrid_CashAmount_' + counter).text();
					while (item) {
						const dividend: NasdaqDividend = { cash: undefined, exdate: undefined, payout: undefined };
						dividend.cash = $('#quotes_content_left_dividendhistoryGrid_CashAmount_' + counter).text();
						dividend.exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_' + counter).text();
						dividend.payout = $('#quotes_content_left_dividendhistoryGrid_PayDate_' + counter).text();

						dividends.push(dividend);
						counter++;
						item = $('#quotes_content_left_dividendhistoryGrid_CashAmount_' + counter).text();
					}
					const dividendInfo: Dividend = addDivInfo(dividends);
					updateDividends(symbol, dividendInfo)
						.then((stock: StockInterface) => resolve(stock), () => { console.log('resolve'); resolve(); })
						.catch(() => { console.log('catch'); resolve(); });
				})
				.catch(error => {
					console.log(error);
				});
		});
	} catch (err) { console.error('NASDAQ ERR', err); }
}
function addDivInfo(dividends: NasdaqDividend[]): Dividend {
	// console.log("getNextDate()", symbol)
	dividends = dividends.filter(div => !!div);
	// nextDate
	const nextDividend = {
		payout: [],
		predicted: undefined,
		date: undefined
	};
	let payoutInterval;
	if (dividends.length > 0) {
		const date = new Date().toISOString();
		// today minus 2 day
		if (Date.parse(date) - 180000000 < Date.parse(dividends[0].exdate)) {
			for (let i = 0; i < dividends.length; i++) {
				if (Date.parse(date) - 180000000 < Date.parse(dividends[i].exdate)) {
					nextDividend['predicted'] = false;
					nextDividend['date'] = new Date(dividends[i].exdate);
					nextDividend.payout[0] = dividends[i].cash;
				} else {
					break;
				}
			}

		} else {
			const interval = [];
			const length = dividends.length < 4 ? dividends.length : 4;
			let high = dividends[0].cash;
			let low = dividends[0].cash;
			for (let i = 1; i < length; i++) {
				if (Date.parse(dividends[i].exdate)) {
					interval.push(Date.parse(dividends[i - 1].exdate) - Date.parse(dividends[i].exdate));
					if (dividends[i].cash > high) {
						high = dividends[i].cash;
					}
					if (dividends[i].cash < low) {
						low = dividends[i].cash;
					}
				}
			}
			const estimatedDate = Date.parse(dividends[0].exdate) + (interval.reduce((a, b) => a + b, 0) / interval.length);
			// console.log("1", date, obj, interval, interval.reduce((a, b) => a + b, 0));
			nextDividend['predicted'] = true;
			nextDividend['date'] = new Date(estimatedDate);

			if (low !== high) {
				nextDividend.payout[0] = low;
				nextDividend.payout[1] = high;
			} else
				nextDividend.payout[0] = low;
		}
		// 8012102000 3 month
		// 2745302000 1 month
		if (dividends[1]) {
			const difference = Date.parse(dividends[0].exdate) - Date.parse(dividends[1].exdate);
			// console.log(difference)
			if (difference < 4045302000) {
				payoutInterval = "Monthly";
			} else if (difference < 9512102000) {
				payoutInterval = "Quarterly";
			} else {
				payoutInterval = "Random";
			}
		}
	}
	const dividentInfo: Dividend = {
		updated_at: new Date(),
		nextDividend: nextDividend,
		data: dividends,
		interval: payoutInterval
	};
	return dividentInfo;
}
