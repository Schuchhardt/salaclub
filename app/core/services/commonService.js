export default ngModule => {
	ngModule.service('CommonService', ($http, $q, CONFIG, API_ROUTES) =>{

		return {
			getRegions: () => {
				const deferred  = $q.defer();
				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.regions,
				}).then( (response) => {
					if (response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response.data);
					}
				}, (error) => {
					deferred.reject(error.data);
				});
				return deferred.promise;
			},

			getRegionDetail: (regionId) => {
				const deferred  = $q.defer();
				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.regions + regionId,
				}).then( (response) =>{
					if (response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response.data);
					}
				}, (error) => {
					deferred.reject(error.data);
				});
				return deferred.promise;
			},

			sendMessage: (message) => {
				const deferred  = $q.defer();
				$http({
					method: 'POST',
					url: CONFIG.apiBaseUrl + API_ROUTES.sendMessage,
					data: message
				}).then( (response) =>{
					if (response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response.data);
					}
				}, (error) => {
					deferred.reject(error.data);
				});
				return deferred.promise;
			}
		};
	});
};
