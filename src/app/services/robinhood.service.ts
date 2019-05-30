import { Injectable } from '@angular/core';
import { SocketService } from './../services/socket.service';
import { ReplaySubject, Subject, Observable } from 'rxjs/';
import { Order, StockInterface, OrderOptions } from './../../../interfaces';
import { RobinhoodAccount } from './../../../interfaces/RobinhoodAccount';
import { distinct, scan, map, tap, filter } from 'rxjs/operators';
import { PositionInterface } from 'interfaces/Position';
import { isEqual } from '../tools/objectIsEqual';
import { ProfileInterface } from 'interfaces/Profile';

@Injectable()
export class RobinhoodService {
	public _rh: any;
	public account: RobinhoodAccount;
	private _account$ = new ReplaySubject<RobinhoodAccount>();
	public activeOrdersMap: { [symbol: string]: Order[] } = {};
	private _orders$ = new ReplaySubject<Order[]>();
	private _profile$ = new ReplaySubject<ProfileInterface>();
	private _positions$ = new ReplaySubject<PositionInterface[]>();
	private _auth$ = new ReplaySubject<boolean>();
	private _username$ = new ReplaySubject<string>();
	private _ordersuccess$ = new Subject<{ success: boolean, error?: string, order?: Order }>();
	private _positions: { [symbol: string]: PositionInterface } = {};

	private fetchStock$ = new Subject();
	private _symbolsList$ = new ReplaySubject<string[]>();
	private _stocksMap$ = new ReplaySubject<{ [symbol: string]: StockInterface }>();
	private _latestStock$ = new Subject<string>();
	private _stocks: { [symbol: string]: StockInterface } = {};
	constructor(public io: SocketService) {
		this.socketsListen();
		this.subToFetchStocks();
	}
	private subToFetchStocks() {
		this.fetchStock$.asObservable()
			.pipe(distinct())
			.subscribe((symbol) => {
				this.io.socket.emit('stock', symbol);
			});
	}

	public stock$(symbol: string): Observable<StockInterface> {
		if (!this._stocks[symbol])
			this.fetchStock(symbol);
		let currentStock;
		return this.stocksMap$
			.pipe(
				map((stockmap) => stockmap[symbol]),
				filter(stock => !!stock),
				filter(stock => !isEqual(currentStock, stock)),
				tap(stock => currentStock = stock)
			);
	}
	public stock(symbol: string) {
		return this._stocks[symbol];
	}
	private fetchStock(symbol: string): void {
		this.fetchStock$.next(symbol);
	}

	public refresh() {
		this.io.socket.emit('orders');
		this.io.socket.emit('account');
		this.io.socket.emit('portfolio');
		this.io.socket.emit('positions');
	}
	public auth(username, password) {
		this.io.socket.emit('auth', { username, password });
		this._username$.next(username);
	}
	public place_sell_order(options: OrderOptions) {
		this.io.socket.emit('place_sell_order', options);
	}
	public place_buy_order(options: OrderOptions) {
		this.io.socket.emit('place_buy_order', options);
	}
	public cancel_order(order) {
		this.io.socket.emit('cancel_order', order);
	}
	public fetchFinvizScreener(url: string) {
		this.io.socket.emit('finviz', url);
	}
	get latestStock$() {
		return this._latestStock$.asObservable();
	}
	get stocksMap$() {
		return this._stocksMap$.asObservable();
	}
	get orders$() {
		return this._orders$.asObservable();
	}
	get profile$() {
		return this._profile$.asObservable();
	}
	get positions$() {
		return this._positions$.asObservable();
	}
	get auth$() {
		return this._auth$.asObservable();
	}
	get username$() {
		return this._username$.asObservable();
	}
	get account$() {
		return this._account$.asObservable();
	}
	get ordersuccess$() {
		return this._ordersuccess$.asObservable();
	}
	get stockList$(): Observable<StockInterface[]> {
		return this.stocksMap$
			.pipe(
				map(stocks => {
					return Object.keys(stocks)
						.map(symbol => {
							if (this._positions[symbol])
								stocks[symbol].position = this._positions[symbol];
							return stocks[symbol];
						});
				}),
			);
	}
	clearStockData() {
		this.fetchStock$ = new Subject();
		this._symbolsList$ = new ReplaySubject<string[]>();
		this._stocksMap$ = new ReplaySubject<{ [symbol: string]: StockInterface }>();
		this._latestStock$ = new Subject<string>();
		this._stocks = {};
	}
	savePostions(positions) {
		positions.forEach((position: PositionInterface) => {
			const symbol = position.instrument.symbol;
			this._positions[symbol] = position;
		});
	}
	get symbolsList$() {
		return this._symbolsList$
			.asObservable()
			.pipe(scan((acc, curr) => acc.concat(curr), []));
	}
	public newStocksList(stocks) {
		this._stocksMap$.next(stocks);
	}
	public addSymbolsToList(symbols: string[]) {
		symbols.forEach(symbol => this.fetchStock(symbol));
	}
	private socketsListen() {
		this.io.socket.on('*', (event, data) => {
			console.log('socket *', event, data);
			if (data) {
				if (event === 'account') {
					this.account = data;
					console.log(this.account);
					this._account$.next(data);
				} else if (event === 'orders') {
					data
						.filter(order => order.state === "queued" || order.state === "confirmed")
						.forEach(order => {
							this.activeOrdersMap[order.instrument.symbol] = [];
							this.activeOrdersMap[order.instrument.symbol].push(order);
						});
					this._orders$.next(data);
				} else if (event === 'profile') this._profile$.next(data);
				else if (event === 'positions') {
					this.savePostions(data);
					this._positions$.next(data);
				} else if (event === 'stock') {
					// update to newest data
					const stockExists = this._stocks[data.symbol];
					this._stocks[data.symbol] = data;
					this._stocksMap$.next(this._stocks);
					if (!stockExists)
						this._latestStock$.next(data.symbol);
				} else if (event === 'auth') {
					this._auth$.next(data);
					if (data)
						this.refresh();
				} else if (event === 'finviz') {
					console.log('finviz', data);
					data.forEach(symbol => this.fetchStock(symbol));
				} else if (event === 'order_success') {
					this.refresh();
					this._ordersuccess$.next(data);
				}
			}
		});
	}

}
