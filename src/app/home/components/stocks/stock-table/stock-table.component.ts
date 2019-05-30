import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ReplaySubject, merge, zip, combineLatest, of, Subject, Observable } from 'rxjs/';
import { RobinhoodService } from './../../../../services/robinhood.service';
import { Instrument, StockInterface, Order } from 'interfaces';
import { ModialDialogService } from 'src/app/services/modial-dialog.service';
import { FormControl } from '@angular/forms';
import { map, startWith, takeUntil, take, switchMap, pluck, toArray, tap } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { fundamentalsColumns, quoteColumns, positionColumns, orderColumns } from './columnData';
import { StockActionsModialComponent } from '../../stock-actions-modial/stock-actions-modial.component';

@Component({
	selector: 'app-stock-table',
	templateUrl: 'stock-table.component.html',
	styleUrls: ['stock-table.component.styl'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class StockTableComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<StockInterface>;
	@Input('stocks$') stocks$: Observable<StockInterface[]>;
	@Input('listType$') listType$: Observable<"orders" | "positions" | "all">;
	symbolColumn: string[] = ['symbol'];
	scoreColumn: string[] = ['risk_score'];
	fundamentalsControl = new FormControl();
	quoteControl = new FormControl();
	positionControl = new FormControl();
	orderControl = new FormControl();

	expandedElement;
	_displayedColumns$: ReplaySubject<string[]> = new ReplaySubject();
	_dataSource$ = new ReplaySubject<MatTableDataSource<StockInterface>>();
	defaultHeader = this.symbolColumn.concat(this.fundamentalsColumnsKeys);
	private _destroyed$ = new Subject();
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	constructor(public RH: RobinhoodService, private Modial: ModialDialogService) {
	}

	ngOnInit() {
		this.subscribeToHeaders();

		this.listType$
			.pipe(takeUntil(this._destroyed$), startWith("all"))
			.subscribe((type) => {
				if (type === 'orders') {
					this.fundamentalsControl.setValue(this.fundamentalsColumnsKeys.filter(key => fundamentalsColumns[key].default));
					this.positionControl.setValue([]);
					this.quoteControl.setValue([]);
					this.orderControl.setValue(this.orderColumnsKeys.filter(key => orderColumns[key].default));
				} else if (type === 'positions') {
					this.fundamentalsControl.setValue(["average_volume_2_weeks", "open", "high",  "low"]);
					this.positionControl.setValue(this.positionColumnsKeys.filter(key => positionColumns[key].default));
					this.quoteControl.setValue(this.quoteColumnsKeys.filter(key => quoteColumns[key].default));
					this.orderControl.setValue([]);
				} else {
					this.fundamentalsControl.setValue(this.fundamentalsColumnsKeys.filter(key => fundamentalsColumns[key].default));
					this.positionControl.setValue([]);
					this.quoteControl.setValue(this.quoteColumnsKeys.filter(key => quoteColumns[key].default));
					this.orderControl.setValue([]);
				}

			});
		this.stocks$
			.pipe(takeUntil(this._destroyed$)).subscribe(stocks => {
				this.dataSource = new MatTableDataSource(stocks);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sortingDataAccessor = (stock, property) => {
					let value;
					if (this.fundamentalsColumnsKeys.indexOf(property) > -1)
						value = stock.fundamentals && stock.fundamentals[property];
					else if (this.quoteColumnsKeys.indexOf(property) > -1)
						value = stock.quote && stock.quote[property];
					else if (this.positionColumnsKeys.indexOf(property) > -1)
						value = stock.position && stock.position[property];
					else if (this.orderColumnsKeys.indexOf(property) > -1) {
						value = stock.order && stock.order[property];
						if (property === "order_quantity")
							value = stock.order["quantity"];
					} else if (property === 'risk_score')
						value = stock.scores.risk.score;
					else
						value = stock.fundamentals[property];
					if (!isNaN(parseFloat(value)))
						value = parseFloat(value);
					return value;
				};
				this.dataSource.sort = this.sort;
				this._dataSource$.next(this.dataSource);
			});
	}


	private subscribeToHeaders() {
		combineLatest(
			of(this.scoreColumn),
			of(this.symbolColumn),
			this.fundamentalsControl.valueChanges,
			this.quoteControl.valueChanges,
			this.positionControl.valueChanges,
			this.orderControl.valueChanges,
			of(["active_orders"])
		).pipe(
			map((all: any[]) => {
				const flattened = all.reduce((acc, val) => acc.concat(val), []);
				return flattened;
			}),
			startWith(this.defaultHeader),
			takeUntil(this._destroyed$)
		).subscribe(headers => {
			this._displayedColumns$.next(headers);
		});
	}
	openStockActionsModial(stock: StockInterface) {
		this.Modial.openDialogLarge(StockActionsModialComponent, stock);
	}
	get dataSource$() {
		return this._dataSource$.asObservable();
	}
	get fundamentalsColumns() {
		return fundamentalsColumns;
	}
	get quoteColumns() {
		return quoteColumns;
	}
	get positionColumns() {
		return positionColumns;
	}
	get orderColumns() {
		return orderColumns;
	}
	get displayedColumns$() {
		return this._displayedColumns$.asObservable();
	}
	get fundamentalsColumnsKeys(): string[] {
		return Object.keys(fundamentalsColumns);
	}
	get quoteColumnsKeys(): string[] {
		return Object.keys(quoteColumns);
	}
	get positionColumnsKeys(): string[] {
		return Object.keys(positionColumns);
	}
	get orderColumnsKeys(): string[] {
		return Object.keys(orderColumns);
	}
	cancelOrder(order: Order): void {
		this.RH.cancel_order(order);
	}
	public getFloat(val) {
		if (typeof val === 'number')
			return val;
		else
			return parseFloat(val);
	}
	public getScoreTooltip(data: any) {
		let string = '';
		for (const prop of Object.keys(data))
			string += prop + ": " + data[prop].toFixed(2) + '; \n';
		return string;
	}
	ngOnDestroy() {
		this._destroyed$.next();
		this._destroyed$.complete();
	}
}
