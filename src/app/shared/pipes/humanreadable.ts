import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'humanreadable'
})
export class HumanReadablePipe implements PipeTransform {

	constructor() {

	}
	transform(value: any, digits?: any): any {
		if (parseInt(value, 10) > 1000000000)
			value = Math.floor((parseInt(value, 10) / 1000000000)) + 'b';
		else if (parseInt(value, 10) > 1000000)
			value = Math.floor((parseInt(value, 10) / 1000000)) + 'm';
		else if (parseInt(value, 10) > 1000)
			value = Math.floor((parseInt(value, 10) / 1000)) + 'k';
		return value;
	}

}
