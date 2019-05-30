import { Component, OnInit } from '@angular/core';
import { RobinhoodService } from './../../../services/robinhood.service';
import { ModialDialogService } from 'src/app/services/modial-dialog.service';
import { take, switchMap, pluck, toArray, tap, map, scan, throttleTime, debounceTime, filter, startWith } from 'rxjs/operators';
import { of, from, zip, Subject, Observable, ReplaySubject, combineLatest } from 'rxjs/';
import { Instrument, StockInterface, Order } from 'interfaces';
import { TradingviewComponent } from '../tradingview-widget/tradingview-widget.component';
import { StockFetchModialComponent } from '../stock-fetch-modial/stock-fetch-modial.component';
import { PositionInterface } from 'interfaces/Position';
import { start } from 'repl';

@Component({
	selector: 'app-stocks',
	templateUrl: 'stocks.component.html',
	styleUrls: ['stocks.component.styl']
})
export class StocksComponent implements OnInit {
	_selectedList$ = new ReplaySubject<"positions" | "buy_orders" | "sell_orders" | "all" | "new" | undefined>();
	_listType$ = new ReplaySubject<"positions" | "orders" | "all" | "new">();
	counter = 0;
	constructor(public RH: RobinhoodService, private Modial: ModialDialogService) { }

	ngOnInit() {
	}
	openStockDialog() {
		this.setSelectedList("all");
		this.Modial.openDialogLarge(StockFetchModialComponent);
	}
	setSelectedList(val?: "positions" | "buy_orders" | "sell_orders" | "all" | "new" | undefined) {
		this._selectedList$.next(val);
	}
	get selectedList$(): Observable<StockInterface[]> {
		return this._selectedList$
			.asObservable()
			.pipe(
				switchMap((selected) => {
					if (selected === "positions") {
						this._listType$.next("positions");
						return this.loadPositions$;
					} else if (selected === "buy_orders") {
						this._listType$.next("orders");
						return this.loadOrders$("buy");
					} else if (selected === "sell_orders") {
						this._listType$.next("orders");
						return this.loadOrders$("sell");
					} else {
						this._listType$.next("all");
						return this.allStockList$;
					}
				})
			);
	}
	get loadPositions$(): Observable<StockInterface[]> {
		return this.RH.positions$
			.pipe(
				map((positions: PositionInterface[]) =>
					positions.map(position => this.RH.stock$(position.instrument.symbol)
						.pipe(
							map((stock => Object.assign(stock, { position }))),
							map((stock => this.addExtraData(stock))),
						))
				),
				switchMap(stocks$ => combineLatest(stocks$)
					.pipe(debounceTime(50))
				),
			);
	}
	get allStockList$(): Observable<StockInterface[]> {
		return this.RH.stockList$
			.pipe(
				map((stocks => stocks.map(stock => this.addExtraData(stock))))
			);
	}
	get listType$() {
		return this._listType$.asObservable();
	}
	loadOrders$(side: "buy" | "sell"): Observable<StockInterface[]> {
		return this.RH.orders$
			.pipe(
				map((orders: Order[]) => orders
					.filter(order => order.side === side)
					.sort((a, b) => {
						if (a.state > b.state) return -1;
						if (a.state < b.state) return 1;
						else return 0;
					})
				),
				map((orders: Order[]) => orders
					.map(order =>
						this.RH.stock$(order.instrument.symbol)
							.pipe(
								map((stock => Object.assign(stock, { order }))),
								map((stock => this.addExtraData(stock))),
								startWith(undefined)
							)
					)
				),
				switchMap(stocks$ => combineLatest(stocks$)
					.pipe(
						debounceTime(50),
						map(stocks => stocks.filter(stock => !!stock)),
						map(stocks => stocks.sort((a, b) => (a.order.state === "confirmed" || a.order.state === "queued") ? -1 : 1))
					)
				),
			);
	}
	addExtraData(stock: StockInterface): StockInterface {
		if (stock && stock.position) {
			addPositionData();
		}
		stock.activeOrders = this.RH.activeOrdersMap[stock.symbol];
		return stock;
		function addPositionData() {
			stock.position.total_value = parseFloat(stock.position.quantity) * stock.quote.last_trade_price;
			stock.position.total_change_value
				= (stock.position.total_value - (parseFloat(stock.position.quantity) * parseFloat(stock.position.average_buy_price)));
			stock.position.total_change = stock.position.total_change_value / stock.position.total_value;

		}
	}
}
