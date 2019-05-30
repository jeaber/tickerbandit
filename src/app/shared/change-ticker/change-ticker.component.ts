import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-change-ticker',
	templateUrl: 'change-ticker.component.html',
	styleUrls: ['change-ticker.component.styl'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeTickerComponent implements OnInit {
	@Input('before') before;
	@Input('after') after;
	constructor() { }

	ngOnInit() { }
}
