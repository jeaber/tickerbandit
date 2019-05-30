import { Component, OnInit } from '@angular/core';
import { RobinhoodService } from '../services/robinhood.service';

@Component({
	selector: 'app-navtop',
	templateUrl: 'navtop.component.html',
	styleUrls: ['navtop.component.styl']
})

export class NavtopComponent implements OnInit {
	constructor(public RH: RobinhoodService) { }

	ngOnInit() { }
}
