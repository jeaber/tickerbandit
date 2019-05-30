import * as robinhood from './app-robinhood';
import { Order, AccountInterface, StockInterface, Quote } from '../interfaces';
// import './bot-main';
import { fetchFinvizScreener, fetchDividendHistory, fetchMarketWatchEPS, fetchFinvizFinancials } from './app-scraper';
import { getStockFromDatabase } from './app-mongo-operations/stock';
import { fetchFundamentals, fetchInstrument, fetchQuote } from './app-robinhood';
import { interval, timer, of, from, concat, merge, Observable, zip } from 'rxjs/';
import { takeUntil, takeWhile, switchMap, catchError, last, take, tap, scan, filter, debounceTime, map } from 'rxjs/operators';
import { RobinhoodAccount } from 'interfaces/RobinhoodAccount';
import { stock$, marketTimer$ } from './main-operations/getUpdatedStock';

export default Sockets;

function Sockets(io) {
	console.log('listening for sockets!');
	try {
		io.on('connection', (socket) => {
			console.log('Socket connected!');
			let RH;
			socket.on('auth', (credentials: { username: string; password: string }) => {
				console.log('socket on auth', credentials);
				robinhood.auth(credentials)
					.then(RobinhoodInstance => { console.log(!!RH), RH = RobinhoodInstance; return; })
					.then(() => socket.emit('auth', !!RH))
					.then(() => {
						socket.on('orders', () => getAndEmitOrders(RH, socket));
						socket.on('account', () => getAndEmitAccount(RH, socket));
						socket.on('positions', () => getAndEmitPositions(RH, socket));
						socket.on('cancel_order', (order) => cancelOrderAndEmit(RH, socket, order));
						socket.on('place_buy_order', (options) => {
							robinhood.place_buy_order(RH, options)
								.then((data) => socket.emit('order_success', data));
						});
						socket.on('place_sell_order', (options) => {
							robinhood.place_sell_order(RH, options)
								.then((data) => socket.emit('order_success', data));
						});
						socket.on('finviz', (url) => getAndEmitFinviz(url, socket));
						socket.on('stock', (symbol: string) => getAndUpdateAndEmitStock(RH, socket, symbol));
					});
				socket.on('disconnect', function () {
					if (RH && RH.username) {
						robinhood.unauth(RH.username)
							.then(() => {
								RH = undefined;
							});
					}
				});
			});
		});
	} catch (e) {
		console.error("socket catch", e);
	}
}
function getAndUpdateAndEmitStock(RH, socket, symbol): void {
	try {
		marketTimer$()
			.pipe(
				takeWhile(() => (!!RH && socket.connected)),
				switchMap(() => stock$(RH, symbol))
			)
			.subscribe((stock: StockInterface) => {
				console.log(stock.symbol, !!RH, socket.connected, socket.disconnected);
				if (stock.scores)
					socket.emit('stock', stock);
			});
	} catch (e) {
		console.error("ERR getAndUpdateAndEmitStock", e);
	}
}

function logHeap() {
	const used = process.memoryUsage().heapUsed / 1024 / 1024;
	console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}
function getAndEmitFinviz(url, socket) {
	fetchFinvizScreener(url)
		.then((symbols: string[]) => {
			socket.emit('finviz', symbols);
		});
}

function getAndEmitOrders(RH, socket) {
	console.log('get orders', !!RH, !!socket);
	if (!RH)
		socket.emit('auth', !RH);
	else
		robinhood.fetchOrders(RH)
			.then((orders: Order[]) => {
				socket.emit('orders', orders);
			});
}
function getAndEmitAccount(RH, socket) {
	if (!RH)
		socket.emit('auth', !RH);
	else
		robinhood.fetchAccount(RH)
			.then((account: RobinhoodAccount) => {
				socket.emit('account', account);
			});
}
function getAndEmitPositions(RH, socket) {
	if (!RH)
		socket.emit('auth', !RH);
	else
		robinhood.positions(RH)
			.then((data: any[]) => {
				socket.emit('positions', data);
			});
}
function cancelOrderAndEmit(RH, socket, order) {
	if (!RH)
		socket.emit('auth', !RH);
	else
		robinhood.cancel_order(RH, order)
			.then((bool: Boolean) => {
				socket.emit('cancel-order', bool);
			});
}
