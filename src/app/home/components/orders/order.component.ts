import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RobinhoodService } from '../../../services/robinhood.service';
import { debounceTime, switchMap, map, takeUntil, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Order } from './../../../../../interfaces';

@Component({
	selector: 'app-orders',
	templateUrl: 'orders.component.html',
	styleUrls: ['orders.component.styl'],
	changeDetection: ChangeDetectionStrategy.OnPush

})
export class OrdersComponent implements OnInit {
	constructor(public RH: RobinhoodService) { }

	ngOnInit() { }
	get activeBuyOrders$() {
		return this.RH.orders$.pipe(map((orders: Order[]) => {
			return orders.filter(order => (order.state === "confirmed" && order.side === 'buy'));
		}));
	}
	get activeSellOrders$() {
		return this.RH.orders$.pipe(map((orders: Order[]) => {
			return orders.filter(order => (order.state === "confirmed" && order.side === 'sell'));
		}));
	}
	get completedOrders$() {
		return this.RH.orders$.pipe(map((orders: Order[]) => {
			return orders.filter(order => (order.state === "filled"));
		}));
	}
}
