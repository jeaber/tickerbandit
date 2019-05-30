import { Instrument } from './Instrument';

export interface Order {
	"updated_at": Date;
	"ref_id": string;
	"time_in_force": "gtc" | "oco" | "gfd";
	"fees": string; // "0.00"
	"cancel": string; // url
	"response_category": string;
	"id": string; // : "38ae79bf-d51d-4287-b0f9-ab59ae1a3722",
	"cumulative_quantity": string; // : "0.00000",
	"stop_price": number; // null
	"reject_reason": null;
	"instrument": Instrument; // url
	"state": "confirmed" | "filled" | "rejected" | "canceled" | "queued";
	"trigger": "immediate";
	"override_dtbp_checks": boolean;
	"type": "limit" | "market";
	"last_transaction_at": Date;
	"price": string; // "41.94000000",
	"executions": any[];
	"extended_hours": boolean;
	"account": string; // "https://api.robinhood.com/accounts/5SC16997/",
	"url": string; // "https://api.robinhood.com/orders/38ae79bf-d51d-4287-b0f9-ab59ae1a3722/",
	"created_at": Date; // "2019-04-04T19:14:36.145196Z",
	"side": "sell" | "buy";
	"override_day_trade_checks": boolean;
	"position": string; // "https://api.robinhood.com/positions/5SC16997/a026d73c-87cb-4f39-b65b-3270afd2c20e/",
	"average_price": string;
	"quantity": string; // "30.00000"
}
