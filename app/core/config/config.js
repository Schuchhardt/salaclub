export default ngModule => {
	const DEV_ENV = (window.location.hostname === "localhost") ?  true : false;
	const API_BASE_URL = DEV_ENV ? '/api/' : `${__API__}`;
	const BASE_URL = DEV_ENV ? 'http://localhost:3000/' : `${__API__}`;
	ngModule.constant('CONFIG', {
		apiBaseUrl: API_BASE_URL,
		baseUrl: BASE_URL,
		devEnv: DEV_ENV,
		secret: 'wt1hpoasdR5FXQwbGljYSRpb42O',
		mapsKey: 'AIzaSyCkyQCh4LM1p8i3aw38djsm-Zdqg4FTmow',
	});
};
