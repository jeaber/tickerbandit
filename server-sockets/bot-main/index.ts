import * as robinhood from './../app-robinhood';
import db from './../app-mongo-operations';
import { fetchFinvizScreener } from '../app-scraper/finviz';
import { fetchMarketWatchEPS } from './../app-scraper/marketwatch';
import { fetchDividendHistory } from '../app-scraper';

const creds = { username: process.env.USERNAME, password: process.env.PASSWORD };
/* robinhood.auth(creds)
	.then((RH) => {
		getAndUpdateStock$(RH, 'X').subscribe();
	}); */
/* const screenerOneUrl =
"https://finviz.com/screener.ashx?v=111&f=cap_smallover,fa_pe_profitable,sh_avgvol_o1000,sh_insiderown_low,ta_rsi_os40&ft=3&o=pe";
fetchFinvizScreener(screenerOneUrl); */
// fetchMarketWatchEPS("ainv");
/* fetchDividendHistory('ai')
	.then((div) => console.log(div));
 */
