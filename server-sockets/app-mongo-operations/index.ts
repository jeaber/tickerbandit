const bluebird = require("bluebird");
const mongoose = require("mongoose");
// Connect to MongoDB
export const MONGODB_URI_LOCAL = process.env["MONGODB_URI_LOCAL"];
const mongoUrl = MONGODB_URI_LOCAL;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(() => {
	console.log("MongooseDB connected!");
}).catch(err => {
	console.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
});
import { updateOrders, getAccountData, updatePortfolio, updateAccount, updatePositions } from './account';
import { updateQuote, updateInstrument, updateFundamentals, updateHistoricals } from './stock';
import Account from './../models/Account';
import Stock from './../models/Stock';
const db = {
	Account, Stock,
	updateOrders, getAccountData, updatePortfolio, updateAccount, updatePositions,
	updateQuote, updateInstrument, updateFundamentals, updateHistoricals
};
export default db;
