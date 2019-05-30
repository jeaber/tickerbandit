import { reject } from 'q';

const _authTokensByUsername = {};

export function auth(credentials: { username: string; password: string; }): Promise<any> {
	return new Promise((resolve) => {
		if (credentials.username && credentials.username) {
			const RH = require('robinhood')(credentials, () => {
				const authtoken = RH.auth_token();
				console.log('authtoken', authtoken);
				if (authtoken && credentials.username) {
					RH.username = credentials.username;
					RH.unauth = unauth;
					resolve(RH);
				} else {
					reject();
				}
			});
		} else {
			reject();
		}
	});
}
export function unauth(username: string) {
	try {
		return new Promise((resolve) => {
			const tokencreds = getTokenCredsByUsername(username);
			if (tokencreds) {
				const RH = require('robinhood')(tokencreds, () => {
					if (RH) {
						RH.expire_token(function (err, response, body) {
							if (err) {
								console.error('UNAUTH ERR', err);
								resolve();
							} else {
								console.log("Successfully logged out of Robinhood and expired token.");
								_authTokensByUsername[username] = undefined;
								resolve();
							}
						});
					} else {
						resolve();
					}
				});
			}
		});
	} catch (e) {
		console.log('failure unauthing', e);
	}
}
function getTokenCredsByUsername(username: string): { token: string; } {
	if (username && _authTokensByUsername[username]) {
		const creds = { token: _authTokensByUsername[username] };
		return creds;
	} else return;
}
