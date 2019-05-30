import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StockInterface, OrderOptions, Order } from './../../../../../interfaces';
import { RobinhoodService } from './../../../services/robinhood.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-stock-actions-modial',
	templateUrl: 'stock-actions-modial.component.html',
	styleUrls: ['stock-actions-modial.component.styl']
})

export class StockActionsModialComponent implements OnInit {
	tradeForm: FormGroup;
	types = [{ name: 'Limit', value: 'limit' }, { name: 'Market', value: 'market' }];
	triggers = [{ name: 'Immediate', value: 'immediate' }, { name: 'Stop', value: 'stop' }];
	time_in_forces = [{ name: 'Good till Canceled', value: 'gtc' }, { name: 'Good For Day', value: 'gfd' }];
	buyOrSell: 'buy' | 'sell' = 'buy';
	placingOrder = false;
	orderData: { success: boolean, error?: string, order?: Order };
	constructor(public RH: RobinhoodService, @Inject(MAT_DIALOG_DATA) public stock: StockInterface) {
		if (stock.position)
			this.buyOrSell = 'sell';
		this.tradeForm = new FormGroup({
			type: new FormControl('limit', [Validators.required]),
			quantity: new FormControl(this.getDefaultQuantity(), [Validators.required, Validators.min(1)]),
			price: new FormControl(this.getDefaultPrice(), [Validators.required, Validators.min(1)]),
			trigger: new FormControl('immediate', [Validators.required]),
			time_in_force: new FormControl('gtc', [Validators.required])
		});
		console.log(this.tradeForm, this.tradeForm.invalid);
	}

	ngOnInit() {

	}
	cancelOrder(order) {
		this.RH.cancel_order(order);
	}
	placeOrder() {
		if (this.placingOrder) return;
		this.placingOrder = true;
		this.RH.ordersuccess$
			.pipe(take(1))
			.subscribe(data => {
				this.placingOrder = false;
				this.orderData = data;
			});
		const order: OrderOptions = {
			type: this.tradeForm.get('type').value,
			quantity: this.tradeForm.get('quantity').value,
			bid_price: this.tradeForm.get('price').value,
			trigger: this.tradeForm.get('trigger').value,
			instrument: {
				url: this.stock.fundamentals.instrument,
				symbol: this.stock.symbol,
			},
			side: this.buyOrSell,
			time: this.tradeForm.get('time_in_force').value

		};
		if (this.buyOrSell === 'buy') {
			console.log('order options', order, 'buy');
			this.RH.place_buy_order(order);
		}
		if (this.buyOrSell === 'sell') {
			console.log('order options', order, 'sell');
			this.RH.place_sell_order(order);
		}
	}
	getDefaultQuantity(): string {
		let qty;
		if (this.buyOrSell === 'buy') {
			const price = this.stock.quote.last_trade_price - (this.stock.quote.last_trade_price * .01);
			let spendlimit = (this.RH.account.portfolio.equity + this.RH.account.margin_balances.margin_limit) * .05;
			if (spendlimit > this.RH.account.portfolio.calculated_buying_power)
				spendlimit = this.RH.account.portfolio.calculated_buying_power;
			console.log('getDefaultQuantity()');
			console.log(price, spendlimit, this.RH.account.portfolio.calculated_buying_power);
			console.log(Math.floor(spendlimit / price));
			qty = Math.floor(spendlimit / price) + "";
		} else {
			qty = Math.floor(parseFloat(this.stock.position.quantity)) + '';
		}
		return qty;
	}
	getDefaultPrice(): number {
		let price;
		if (this.buyOrSell === 'buy') {
			price = parseFloat((this.stock.quote.last_trade_price - (this.stock.quote.last_trade_price * .01)).toFixed(2));
		} else {
			price = parseFloat((this.stock.quote.last_trade_price +
				(this.stock.quote.last_trade_price * this.stock.financials.volatility_pct.week * .01)).toFixed(2));
		}
		return price;
	}
}
