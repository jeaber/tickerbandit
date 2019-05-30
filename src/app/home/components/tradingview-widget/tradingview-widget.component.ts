import { Component, OnInit, Input, Inject } from '@angular/core';
import { Instrument } from './../../../../../interfaces';
declare const TradingView: any;
@Component({
	selector: 'app-tradingview-widget',
	templateUrl: 'tradingview-widget.component.html',
	styleUrls: ['tradingview-widget.component.styl'],
})

export class TradingviewComponent implements OnInit {
	private _instrument: Instrument;
	constructor() {
	}
	ngOnInit() { }
	get instrument(): Instrument {
		return this._instrument;
	}
	@Input()
	set instrument(instrument: Instrument) {
		this._instrument = instrument;
		if (this._instrument)
			this.loadWidget();
	}
	loadWidget() {
		const widget = new TradingView.widget({
			"width": 600,
			"height": 350,
			"symbol": `${this.instrument.market.acronym}:${this.instrument.symbol}`, // "NASDAQ:AAPL",
			"interval": "D",
			"timezone": "Etc/UTC",
			"theme": "Light",
			"style": "1",
			"locale": "en",
			"toolbar_bg": "#f1f3f6",
			"enable_publishing": false,
			"allow_symbol_change": true,
			"container_id": "tradingview_63ce6"
		});
	}
}
