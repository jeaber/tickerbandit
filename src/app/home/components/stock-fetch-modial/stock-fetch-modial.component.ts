import { Component, OnInit } from '@angular/core';
import { RobinhoodService } from 'src/app/services/robinhood.service';
import { Subject, ReplaySubject } from 'rxjs/';
import { scan, take } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-stock-fetch-modial',
	templateUrl: 'stock-fetch-modial.component.html'
})

export class StockFetchModialComponent implements OnInit {
	screener1 = "https://finviz.com/screener.ashx?v=111&f=cap_smallover,fa_pe_profitable,sh_avgvol_o1000,sh_insiderown_low,ta_rsi_os40&o=pe";
	private _currentList$ = new ReplaySubject<string[]>();
	symbolControl = new FormControl('', Validators.required);
	finvizUrlControl = new FormControl(this.screener1, [Validators.required, Validators.pattern(/http/)]);
	constructor(public RH: RobinhoodService) { }

	ngOnInit() { }

	addToStockList() {
		this.addToCurrentList(this.symbolControl.value);
		this.symbolControl.setValue('');
	}
	addToCurrentList(string: string) {
		if (string && string.length > 0) {
			const array = string
				.replace(",", " ")
				.replace("  ", " ")
				.toUpperCase()
				.split(' ')
				.filter(str => !containsNonChars(str))
				.filter(str => (str.length > 0 && str.length < 5));
			console.log(array);
			this.RH.addSymbolsToList(array);
		}
		function containsNonChars(str) {
			return !!str.match(/[^a-z]/gi);
		}
	}

	get currentList$() {
		return this._currentList$.asObservable()
			.pipe(scan((acc, curr) => acc.concat(curr), []));
	}
	fetchFinvizUrl() {
		if (this.finvizUrlControl.valid)
			this.RH.fetchFinvizScreener(this.finvizUrlControl.value);
	}
}
