import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { HttpClientModule } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { QueueService } from './services/queue.service';
import { RobinhoodService } from './services/robinhood.service';
import { SocketService } from './services/socket.service';
import { OrdersComponent, AccountComponent, HomeComponent } from './home';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatListModule, MatSidenavModule, MatCardModule, MatTooltipModule,
  MatButtonModule, MatInputModule, MatTableModule, MatDialogModule,
  MatSelectModule, MatPaginatorModule, MatSortModule, MatButtonToggleModule
} from '@angular/material';
import { ModialDialogService } from './services/modial-dialog.service';
import { NavtopComponent } from './navtop/navtop.component';
import { LoginComponent } from './login/login.component';
import { StocksComponent } from './home/components/stocks/stocks.component';
import { StockTableComponent } from './home/components/stocks/stock-table/stock-table.component';
import { ChangeTickerComponent } from './shared/change-ticker/change-ticker.component';
import { HumanReadablePipe } from './shared/pipes/humanreadable';
import { TradingviewComponent } from './home/components/tradingview-widget/tradingview-widget.component';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // has to be above routermodule
import { EpsDivChartComponent } from './home/components/stocks/stock-table/eps-div-chart/eps-div-chart.component';
import { StockFetchModialComponent } from './home/components/stock-fetch-modial/stock-fetch-modial.component';
import { StockActionsModialComponent } from './home/components/stock-actions-modial/stock-actions-modial.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrdersComponent,
    AccountComponent,
    NavtopComponent,
    LoginComponent,
    StocksComponent,
    StockTableComponent,
    ChangeTickerComponent,
    HumanReadablePipe,
    TradingviewComponent,
    EpsDivChartComponent,
    StockFetchModialComponent,
    StockActionsModialComponent
  ],
  entryComponents: [StockFetchModialComponent, StockActionsModialComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgxChartsModule,
    AppRoutingModule,
    CommonModule,
    TransferHttpCacheModule,
    HttpClientModule,
    NgtUniversalModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    MatSidenavModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonToggleModule
  ],
  providers: [QueueService, RobinhoodService, SocketService, ModialDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
