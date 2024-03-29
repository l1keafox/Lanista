import decode from "jwt-decode";
// create a new class to instantiate for a user
class AuthService {
	// get user data from JSON web token by decoding it
	getUser() {
		// adding logic here to make sure when there is a token.
		let token = this.getToken();
		if (!token) {
//			console.log('No token');
			return false;
		}
		const decoded =decode(token);
		if(new Date() - new Date(decoded.timeCreated) > 43200000){
			console.log('Time out on date');
			this.logout();
			return false;
		}
		return decoded;
	}

	// return `true` or `false` if token exists (does not verify if it's expired yet)
	loggedIn() {
		const token = this.getToken();
		return token ? true : false;
	}

	getToken() {
		// Retrieves the user token from localStorage
		return localStorage.getItem("id_token");
	}

	login(idToken) {
		// Saves user token to localStorage and reloads the application for logged in status to take effect

		//console.log(idToken, "Token is logging IN Data");
		
		localStorage.setItem("id_token", idToken);
		//window.location.assign("/games");
	}

	logout() {
		// Clear user token and user data from localStorage
		localStorage.removeItem("id_token");
		// this will reload the page and reset the state of the application
		window.location.replace("/");
	}
}

export default new AuthService();
