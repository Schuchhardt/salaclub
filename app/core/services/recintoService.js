export default ngModule => {
	ngModule.service('RecintoService', ($http, $q, CONFIG, API_ROUTES) => {

		return {
			getAllRecintos: (position) => {
				const deferred  = $q.defer();
				let coordSlug = '';
				if (position) {
					coordSlug = `by_location?lat=${position.lat}&lon=${position.lon}`;
				}
				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.recintos + coordSlug,
				}).then( (response) =>{
					if (response && response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response);
					}
				}, (error) =>{
					deferred.reject(error);
				});
				return deferred.promise;
			},
			getRecinto: (recintoId) => {
				const deferred  = $q.defer();

				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.recintos + recintoId,
				}).then( (response) =>{
					if (response && response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response);
					}
				}, (error) =>{
					deferred.reject(error);
				});
				return deferred.promise;
			},
			getScheduleByDate: (recintoId, date) => {
				const deferred  = $q.defer();

				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.recintos + recintoId + "/schedule/" + date,
				}).then( (response) =>{
					if (response && response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response);
					}
				}, (error) =>{
					deferred.reject(error);
				});
				return deferred.promise;
			},
			reservarCancha: (order) => {
				const deferred  = $q.defer();

				$http({
					method: 'POST',
					url: CONFIG.apiBaseUrl + API_ROUTES.canchas + 'reserve/' +  order.field_id,
					data: order,
				}).then( (response) =>{
					if (response && response.data) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response);
					}
				}, (error) =>{
					deferred.reject(error);
				});
				return deferred.promise;
			}
		};
	});
};
