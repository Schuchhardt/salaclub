export default ngModule => {

	ngModule.directive('loginForm', function loginForm(AuthService, $timeout, StorageService, $state, $ionicPopup, $ionicLoading, $rootScope) {
		return {
			template: require('./login-form.jade'),
			restrict: "E",
			transclude: true,
			controllerAs: 'login',
			controller: function LoginFormCtrl() {

				const vm = this;
				vm.title = "Para Reservar debes iniciar sesión.";

				vm.isModal = $state.current.name === 'login' ? false : true;

				vm.signIn = (user) => {
					if (vm.loading === true) return false;

					vm.loading = true;
					$ionicLoading.show({template: require('../../common/loading.jade') });

					AuthService.signIn(user).then( (response) => {
						vm.loading = false;
						$ionicLoading.hide();
						StorageService.setObject('currentUser', response);
						if (vm.isModal) {
							$rootScope.$broadcast('userLogged');
						} else {
							$state.go('home.partidos');
						}

					}, (error) => {
						vm.loading = false;
						$ionicLoading.hide();
						vm.errorMessage = {show: true, msg: error.message};
						$timeout(function() {
							vm.errorMessage.show = false;
						}, 3000);
					});
				};

				vm.showRecover = () =>{
					$rootScope.$broadcast('AuthForm.setOptions', {activeModule: 'recover', login: true, register: true});
				};

				$rootScope.$on('loginForm.setOptions', (e, options) => {
					angular.extend(vm, options);
				});

			}
		};
	});
};
