import { StockInterface, Quote } from './../../interfaces';
import { fetchFinvizFinancials, fetchMarketWatchEPS, fetchDividendHistory } from './../app-scraper';
import { Observable, from, of, merge, timer } from 'rxjs/';
import { fetchQuote, fetchInstrument, fetchFundamentals } from './../app-robinhood';
import { filter, take, scan, map, tap, debounceTime, takeUntil, switchMap, takeWhile } from 'rxjs/operators';
import { getStockFromDatabase } from './../app-mongo-operations/stock';

export function marketTimer$(): Observable<number> {
	const threeMinutes = 180000;
	return timer(0, threeMinutes)
		.pipe(
			filter((val) => (isMarketOpen() || val === 0))
		);
	function isMarketOpen(): boolean {
		const date = new Date();
		const day = date.getDay();
		const utcHours = date.getUTCHours();
		return (day > 0 && day < 6) && (utcHours < 20 && utcHours > 13);
	}
}

export function stock$(RH, symbol: string): Observable<StockInterface> {
	if (symbol.match(/[^a-z]/gi)) return;
	try {
		return from(getStockFromDatabase(symbol))
			.pipe(
				switchMap((stock: StockInterface) =>
					checkOrFetchFundamentals(stock)
						.pipe(
							switchMap(val => mergeAllChecks(val))
						)
				),
				takeUntil(timer(3000)),
				debounceTime(250),
				map((stock) => Object.assign({}, stock)['_doc']),
				map(stock => addExtraData(stock))
			);
	} catch (e) {
		console.error("getAndUpdateStock$", e);
	}
	function mergeAllChecks(stock: StockInterface): Observable<StockInterface> {
		try {
			if (stock && stock.symbol && stock.fundamentals) {
				return merge(
					checkOrFetchInstrument(stock),
					checkOrFetchQuote(stock),
					checkOrFetchDividendHistory(stock),
					checkOrFetchMarketWatchEPS(stock),
					checkOrFetchFinvizFinancials(stock)
				).pipe(
					scan((acc: StockInterface, curr: StockInterface) => Object.assign(acc, curr), stock),
				);
			} else
				return of();
		} catch (e) {
			console.error("mergeAllChecks", e);
		}
	}
	function checkOrFetchFundamentals(stock: StockInterface): Observable<StockInterface> {
		try {
			const obs$ = !!(stock && hasData(stock.fundamentals)) ?
				of(stock) : from(fetchFundamentals(RH, symbol));
			return obs$.pipe(take(1), filter(val => (!!val && hasData(val.fundamentals))));
		} catch (e) {
			console.error("checkOrFetchFundamentals", e);
		}
	}
	function checkOrFetchInstrument(stock): Observable<StockInterface> {
		try {
			return (stock && stock.instrument && hasData(stock.instrument)) ?
				of(stock) : from(fetchInstrument(RH, symbol));
		} catch (e) {
			console.error("checkOrFetchFundamentals", e);
		}
	}

	function checkOrFetchQuote(stock): Observable<StockInterface> {
		try {
			return (stock && hasData(stock.quote) && !isOutdatedQuote(stock.quote))
				? of(stock) : from(fetchQuote(RH, symbol));
		} catch (e) {
			console.error("checkOrFetchQuote", e);
		}
		function isOutdatedQuote(quote: Quote): boolean {
			return (quote && quote.updated_at) ? (Date.now() - Date.parse(quote.updated_at)) > 179000 : false;
		}
	}

	function checkOrFetchDividendHistory(stock): Observable<StockInterface> {
		try {
			return (stock && stock.fundamentals && hasDividendYeildData())
				? of(stock) : from(fetchDividendHistory(symbol));
		} catch (e) {
			console.error("checkOrFetchDividendHistory", e);
		}
		function hasDividendYeildData(): boolean {
			return (hasData(stock.dividends));
		}
	}

	function checkOrFetchMarketWatchEPS(stock): Observable<StockInterface> {
		try {
			return (stock && hasData(stock.eps)) ? of(stock) : from(fetchMarketWatchEPS(symbol));
		} catch (e) {
			console.error("checkOrFetchMarketWatchEPS", e);
		}
	}
	function checkOrFetchFinvizFinancials(stock): Observable<StockInterface> {
		try {
			return (stock && hasData(stock.financials) && !isOutdatedFinancials(stock.financials))
				? of(stock) : from(fetchFinvizFinancials(symbol));
		} catch (e) {
			console.error("checkOrFetchMarketWatchEPS", e);
		}
		function isOutdatedFinancials(financials: any): boolean {
			return (financials && financials.updated_at) ? (Date.now() - Date.parse(financials.updated_at)) > (179000 * 20 * 24 * 7) : false;
		}
	}

	function hasData(obj: any): boolean {
		try {
			const copy = Object.assign({}, obj);
			for (const prop of Object.keys(copy)) {
				if (!copy[prop] && typeof copy[prop] !== "boolean")
					delete copy[prop];
			}
			delete copy['updated'];
			if (!copy['updated_at'])
				return false;
			else {
				delete copy['updated_at'];
				delete copy['$init'];
				return (copy && typeof copy === 'object' && Object.keys(copy).length > 0);
			}
		} catch (e) {
			console.error("hasData", e);
		}
	}
}
function addExtraData(stock: StockInterface): StockInterface {
	stock.scores = { risk: getRiskScoringData() };
	return stock;
	function getRiskScoringData() {
		const scoresArray = [];
		const weights = {};
		let risk;
		if (stock && stock.fundamentals) {
			let yearscore: number = (new Date().getFullYear() - stock.fundamentals.year_founded) / 100;
			yearscore = (yearscore > 1) ? 1 : yearscore;
			let pescore: number = 1 - (parseFloat(stock.fundamentals.pe_ratio) / 30);
			pescore = (pescore > 1) ? 1 : pescore;
			pescore = (pescore < -1) ? 0 : pescore;
			if (isNaN(pescore)) pescore = -1;
			let volumescore: number = parseInt(stock.fundamentals.average_volume_2_weeks, 10) / 10000000;
			volumescore = (volumescore > 1) ? 1 : volumescore;
			let mktcapscore = parseInt(stock.fundamentals.market_cap, 10) / 5000000000;
			if (isNaN(mktcapscore)) mktcapscore = -1;
			mktcapscore = (mktcapscore > 1) ? 1 : mktcapscore;
			mktcapscore = (mktcapscore < -1) ? -1 : mktcapscore;

			const divscore = makedivscore(stock);
			const epsscore = makeEPSscore(stock);
			let employeescore = stock.fundamentals.num_employees ? ((stock.fundamentals.num_employees / 300)) : 0;
			employeescore = (employeescore > 1) ? 1 : employeescore;
			employeescore = employeescore / 2;
			scoresArray.push(yearscore, pescore, volumescore, divscore, epsscore, employeescore, mktcapscore);
			risk = {
				score: scoresArray.reduce((acc, c) => acc + c, 0) / scoresArray.length,
				data: { yearscore, pescore, volumescore, divscore, epsscore, employeescore, mktcapscore }
			};
		}
		return risk;

		function makedivscore(st: StockInterface) {
			if (st.dividends && st.dividends.data && (st.dividends.data.length > 0) && st.fundamentals.dividend_yield) {
				const divtotal = (st.dividends.data.reduce((acc, c) => acc + parseFloat(c.cash), 0));
				const lastdivyear = new Date(st.dividends.data[st.dividends.data.length - 1].exdate).getFullYear();
				const addNumofZeros = (new Date().getFullYear() - lastdivyear) * 4;
				const divlength = st.dividends.data.length + addNumofZeros;
				const divavg = divtotal / divlength;
				const divtrend = parseFloat(st.dividends.data[st.dividends.data.length - 1].cash) / divavg;
				let score = (parseFloat(st.fundamentals.dividend_yield) / 10) + (divtrend / 2);
				if (score > 1) score = 1;
				if (score < -1) score = -1;
				return score / 2;
			} else
				return 0;
		}
		function makeEPSscore(st: StockInterface) {
			if (st.eps && st.eps.data && (st.eps.data.length > 0)) {
				st.eps.data.map(data => {
					return data;
				});
				const epsavg = (st.eps.data.reduce((acc, c) => acc + c.eps, 0) / st.eps.data.length);
				const epstrend = Math.abs(st.eps.data[st.eps.data.length - 1].eps) / epsavg;
				let score = (epsavg + epstrend) / 2;
				if (score > 1) score = 1;
				if (score < -2) score = -2;
				return score;
			} else
				return -.5;
		}
	}
}
