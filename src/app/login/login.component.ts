import { Component, OnInit } from '@angular/core';
import { RobinhoodService } from '../services/robinhood.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.styl']
})

export class LoginComponent implements OnInit {
	username = new FormControl('', [Validators.required, Validators.minLength(4)]);
	password = new FormControl('', [Validators.required, Validators.minLength(4)]);
	loginForm;
	loggingIn = false;
	constructor(public RH: RobinhoodService) { }

	ngOnInit() {
		this.loginForm = new FormGroup({ 'username': this.username, 'password': this.password });
	}
	login() {
		console.log('logging in');
		if (!this.loggingIn) {
			this.RH.auth(this.username.value, this.password.value);
			this.loggingIn = true;
		}
	}
}
