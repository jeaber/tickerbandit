import { Component } from '@angular/core';
import { RobinhoodService } from './services/robinhood.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'TickerBandit';
  constructor(public RH: RobinhoodService) { }
}
