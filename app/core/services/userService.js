export default ngModule => {
	ngModule.service('UserService', ($http, $q, CONFIG, API_ROUTES) => {

		return {
			getReservations: (userId) => {
				const deferred  = $q.defer();
				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.users + userId + '/reservations',
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
			getReservation: (reservationId) => {
				const deferred  = $q.defer();
				$http({
					method: 'GET',
					url: CONFIG.apiBaseUrl + API_ROUTES.reservations + reservationId,
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
			setRanking: (ranking) => {
				const deferred  = $q.defer();
				$http({
					method: 'POST',
					url: CONFIG.apiBaseUrl + API_ROUTES.recintos + ranking.local_id + '/ranking',
					data: ranking
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
			cancelReservation: (reservationId) => {
				const deferred  = $q.defer();
				$http({
					method: 'DELETE',
					url: CONFIG.apiBaseUrl + API_ROUTES.reservations + reservationId,
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
