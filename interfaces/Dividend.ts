export interface Dividend {
	updated_at: Date;
	nextDividend: {
		predicted: boolean;
		date: Date,
		payout: string[],
	};
	data: NasdaqDividend[];
	interval: string;
}

export interface NasdaqDividend {
	cash: string; exdate: string; payout: string;
}
