export default ngModule => {
	ngModule.service('AuthService', ($http, $q, CONFIG, API_ROUTES, StorageService) =>{
		
		return {
			signIn: (user) => {
				const deferred  = $q.defer();
				$http({
					method: 'POST',
					url: CONFIG.apiBaseUrl + API_ROUTES.signIn,
					data: {
						user: user
					},
				}).then( (response) =>{
					if (response.data && response.data.success) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response.data);	
					}
				}, (error) =>{
					deferred.reject(error.data);
				});
				return deferred.promise;
			},

			register: (user) => {
				const deferred  = $q.defer();
				$http({
					method: 'POST',
					url: CONFIG.apiBaseUrl + API_ROUTES.register,
					data: {
						user: user
					},
				}).then( (response) =>{
					if (response.data && response.data.error !== true) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response.data);	
					}
				}, (error) =>{
					deferred.reject(error.data);
				});
				return deferred.promise;
			},

			logOut: () => {
				console.log("Usuario Sale.");
				StorageService.clear();
			},

			getCurrentUser: () =>{
					const deferred  = $q.defer();
					const userInfo = StorageService.getObject('currentUser', {});
					$http({
						method: 'GET',
						url: CONFIG.apiBaseUrl + API_ROUTES.users + userInfo.user.id,
					}).then( (response) =>{
						if (response.data && response.data.user) {
							userInfo.user = response.data.user;
							StorageService.setObject('currentUser', userInfo);
							deferred.resolve(response.data);
						} else {
							deferred.reject(response.data);	
						}
					}, (error) =>{
						deferred.reject(error.data);
					});
					return deferred.promise;
			},

			update: (user) => {
				const deferred  = $q.defer();
				$http({
					method: 'PUT',
					url: CONFIG.apiBaseUrl + API_ROUTES.users + user.id,
					data: {
						user: user
					},
				}).then( (response) =>{
					if (response.data && !response.error) {
						deferred.resolve(response.data);
					} else {
						deferred.reject(response.data);	
					}
				}, (error) =>{
					deferred.reject(error.data);
				});
				return deferred.promise;
			},

			resetPassword: (user) => {
					const deferred  = $q.defer();
					$http({
						method: 'POST',
						url: CONFIG.apiBaseUrl + API_ROUTES.reset,
						data: {
							user: {
								email: user.email,
							}
						},
					}).then( (response) =>{
						if (response.data && response.data.success) {
							deferred.resolve(response.data);
						} else {
							deferred.reject(response.data);	
						}
					}, (error) =>{
						deferred.reject(error.data);
					});
					return deferred.promise;
			},
		};
	});
};
