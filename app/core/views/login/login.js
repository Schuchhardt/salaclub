export default ngModule => {
	ngModule.controller('LoginCtrl', function LoginCtrl (AuthService, $ionicLoading) {

		const vm = this;

		vm.recoverPass = (user) => {
			$ionicLoading.show({template: require('../common/loading.jade') });

			AuthService.resetPassword(user).then( (response) => {
				vm.recoverResponse = {success: response.success, message: response.message};
				$ionicLoading.hide();
			}, (error) => {
				console.log(error);
				$ionicLoading.hide();
			});
		};

	});
};
