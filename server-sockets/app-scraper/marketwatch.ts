import { updateMarketWatchEPS } from '../app-mongo-operations/stock';

import * as cheerio from 'cheerio';
import { StockInterface } from 'interfaces';
const axios = require('axios');
export function fetchMarketWatchEPS(symbol: string): Promise<StockInterface> {
	try {
		return new Promise((resolve) => {
			if (!symbol) { resolve(); return; }
			const url = `https://www.marketwatch.com/investing/stock/${symbol}/financials`;
			console.log(`fetching MW EPS ${symbol} from ${url}`);
			axios.get(url)
				.then(response => {
					const $ = cheerio.load(response.data);
					return $;
				}, () => resolve())
				.then(($: CheerioStatic) => {
					const values = [];
					const years = [];
					$("tr.mainRow td a[data-ref=ratio_Eps1YrAnnualGrowth]")
						.parent().parent().children().filter('.valueCell')
						.each((i, value) => values.push($(value).text()));
					$("table.crDataTable tr.topRow th[scope=col]")
						.each((i, ele) => {
							const value = $(ele).text();
							if (value.length === 4)
								years.push(value);
						});
					let epsByYear = values.map((val, i) => ({ year: years[i], eps: val }));
					epsByYear = epsByYear.filter(data => data.eps !== "-").map(epsdata => {
						if (epsdata.eps.indexOf("(") === 0)
							epsdata.eps = parseFloat('-' + epsdata.eps.replace("(", "").replace(")", ""));
						return epsdata;
					}).filter(data => !isNaN(data.eps));
					console.log(symbol, epsByYear);
					updateMarketWatchEPS(symbol, epsByYear)
						.then((stock: StockInterface) => resolve(stock), () => { console.log('resolve'); resolve(); })
						.catch(() => { console.log('catch'); resolve(); });
				}, () => resolve())
				.catch(err => { console.error('fetch mw eps error', err); resolve(); });
		});
	} catch (e) {
		console.error(e);
	}
}
