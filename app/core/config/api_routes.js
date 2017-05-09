export default ngModule => {
	ngModule.constant('API_ROUTES', {
		users: 'users/',
		signIn: 'users/sign_in/',
		register: 'users/register',
		reset: 'users/reset',
		recintos: 'locals/',
		canchas: 'fields/',
		regions: 'regions/',
		reservations: 'reservations/',
		sendMessage: 'message/'
	});
};
