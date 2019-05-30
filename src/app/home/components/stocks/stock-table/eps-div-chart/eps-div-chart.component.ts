import { Component, OnInit, Input } from '@angular/core';
import { Dividend } from './../../../../../../../interfaces/Dividend';

@Component({
	selector: 'app-eps-div-chart',
	templateUrl: 'eps-div-chart.component.html',
	styleUrls: ['eps-div-chart.component.styl']
})

export class EpsDivChartComponent implements OnInit {
	@Input('eps') eps: { updated_at: Date; data: { year: string, eps: string }[] };
	@Input('div') div: Dividend;
	public chartsdata;
	view: any[] = [300, 200];

	// options
	showXAxis = true;
	showYAxis = true;
	gradient = false;
	showLegend = false;
	showXAxisLabel = false;
	xAxisLabel = 'Number';
	showYAxisLabel = false;
	yAxisLabel = 'Color Value';
	timeline = true;

	colorScheme = {
		domain: ['lightblue']
	};
	customColors = [{
		name: 'Positive',
		value: 'green'
	},
	{
		name: 'Negative',
		value: 'red'
	}];
	// line, area
	autoScale = true;
	constructor() { }

	ngOnInit() {
		this.chartsdata = [];
		if (this.eps && this.eps.data && this.eps.data.length > 0) {
			const epsseries = {
				"name": "EPS",
				"series": this.eps.data
					.map(epsdata => {
						let floateps;
						if (typeof epsdata.eps === 'string' && epsdata.eps.substring(0, 1) === "(") {
							if (typeof epsdata.eps === 'string')
								floateps = parseFloat('-' + epsdata.eps.replace("(", "").replace(")", ""));
						} else {
							floateps = parseFloat(epsdata.eps);
						}
						epsdata.eps = floateps;
						return epsdata;
					})
					.filter(epsdata => !isNaN(parseFloat(epsdata.eps)))
					.map(epsdata => {
						const floateps = parseFloat(epsdata.eps);
						return {
							"name": floateps > 0 ? 'Positive' : 'Negative',
							"x": `4/${new Date(epsdata.year).getFullYear()}`,
							"y": floateps,
							"r": floateps,
						};
					})
			};
			this.chartsdata.push(epsseries);
		}
		if (this.div && this.div.data && this.div.data.length > 0) {
			const divseries = {
				"name": "Dividends",
				"series": this.div.data.filter(divdata => !isNaN(parseFloat(divdata.cash))).map(divdata => {
					return {
						"name": parseFloat(divdata.cash) > 0 ? 'Positive' : 'Negative',
						"x": `${new Date(divdata.exdate).getMonth()}/${new Date(divdata.exdate).getFullYear()}`,
						"y": parseFloat(divdata.cash),
						"r": parseFloat(divdata.cash),
					};
				}).reverse()
			};
			this.chartsdata.push(divseries);
		}
		console.log('chartsdata', this.chartsdata);
		console.log('inputs', this.eps, this.div);
	}
}
