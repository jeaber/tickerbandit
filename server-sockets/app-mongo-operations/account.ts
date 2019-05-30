import Account from "./../models/Account";
import { Order, AccountInterface } from './../../interfaces';
import { RobinhoodAccount } from 'interfaces/RobinhoodAccount';

export function getAccountData(Robinhood, socket?): Promise<AccountInterface> {
	const username = Robinhood.username;
	return new Promise((resolve) => {
		console.log("get data from db", username);
		Account.findOne({ username }, (err, data: AccountInterface) => {
			if (err)
				console.error(err);
			console.log("accountData() response", data);
			resolve(data);
			if (data && socket) {
				socket.emit('profile', data['profile']);
				socket.emit('account', data['account']);
				socket.emit('url', data['portfolio']);
				socket.emit('positions', data['positions']);
				socket.emit('orders', data['orders']);
				socket.emit('buylist', data.buylist);
			}
		});
	});
}
export function updateAccount(username, account: RobinhoodAccount): Promise<RobinhoodAccount> {
	return new Promise(resolve => {
		Account.findOneAndUpdate(
			{ username },
			{
				account
			},
			{ upsert: true, new: true, runValidators: true }, function (err, result: AccountInterface) {
				if (err) console.error(err);
				console.log('MDB Update: accounts');
				resolve(result.account);
			});
	});
}
export function updateOrders(username, data: Order[]) {
	Account.findOneAndUpdate(
		{ username },
		{
			orders: data
		},
		{ upsert: true, new: true, runValidators: true }, function (err, result) {
			if (err) console.error(err);
			console.log('MDB ORDERS updated', username);
		});
}

export function updateProfile(username, data) {
	Account.findOneAndUpdate(
		{ username },
		{
			profile: data
		},
		{ upsert: true, new: true, runValidators: true }, function (err, result) {
			if (err) console.error(err);
			console.log('MDB PROFILE updated', username);
		});
}
export function updatePortfolio(username, data) {
	Account.findOneAndUpdate(
		{ username },
		{
			portfolio: data
		},
		{ upsert: true, new: true, runValidators: true }, function (err, result) {
			if (err) console.error(err);
			console.log('MDB PROFILE updated', username);
		});
}
export function updatePositions(username, data: any[]) {
	Account.findOneAndUpdate(
		{ username },
		{
			positions: data
		},
		{ upsert: true, new: true, runValidators: true }, function (err, result) {
			if (err) console.error(err);
			console.log('MDB PROFILE updated', username);
		});
}
