import { updateFinvizFinancials } from './../app-mongo-operations/stock';
import { StockInterface } from './../../interfaces';

const cheerio = require('cheerio');
const axios = require('axios');
export function fetchFinvizScreener(url): Promise<string[]> {
	try {
		return new Promise((resolve, reject) => {
			axios.get(url)
				.then(response => {
					const $ = cheerio.load(response.data);
					return $;
				}, () => reject())
				.then(($: CheerioStatic) => {
					const symbols: string[] = [];
					$('#screener-content td.screener-body-table-nw > a.screener-link-primary')
						.each((i, symbol) => symbols.push($(symbol).text()));
					resolve(symbols);
				})
				.catch(err => console.error(err));
		});
	} catch (e) {
		console.error(e);
	}
}
export function fetchFinvizFinancials(symbol: string): Promise<StockInterface> {
	try {
		const url = `https://finviz.com/quote.ashx?t=${symbol}&ty=c&p=d&b=1`;
		return new Promise((resolve, reject) => {
			axios.get(url)
				.then(response => {
					const $ = cheerio.load(response.data);
					return $;
				}, () => reject())
				.then(($: CheerioStatic) => {
					const financials = {
						updated_at: new Date()
					};
					let currentprop;
					$('table.snapshot-table2 tbody tr.table-dark-row td')
						.each((i, ele) => {
							if (i % 2 === 0) {
								currentprop = $(ele).text();
							} else {
								let value = $(ele).text();
								if (value.indexOf('%') > -1) {
									currentprop += '_pct';
									value = value.replace(/\%/g, '');
								}
								currentprop = currentprop.toLowerCase()
									.replace(/\%/g, '').replace(/\(/g, '').replace(/\)/g, '')
									.replace(/\//g, '').replace(/\ /g, '_')
									.replace(/\_\_/g, '_').replace(/\./g, '');
								value = value.replace(/\,/g, '');
								if (value === '-') value = undefined;
								financials[currentprop] = value;
								currentprop = undefined;
							}
						});
					const volitilitystr = financials['volatility_pct'];
					financials['volatility_pct'] = {
						week: volitilitystr.substring(0, volitilitystr.indexOf(' ')).replace(/%/g, ''),
						month: volitilitystr.substring(volitilitystr.indexOf(' ') + 1).replace(/%/g, '')
					};
					updateFinvizFinancials(symbol, financials).then(stock => {
						resolve(stock);
					});
				})
				.catch(err => console.error(err));
		});
	} catch (e) {
		console.error(e);
	}
}
