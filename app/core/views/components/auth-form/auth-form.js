export default ngModule => {

	ngModule.directive('authForm', function authForm(AuthService, $timeout, StorageService, $state, $ionicPopup, $ionicLoading, $rootScope) {
		return {
			template: require('./auth-form.jade'),
			restrict: "E",
			transclude: true,
			controllerAs: 'auth',
			controller: function AuthFormCtrl() {

				const vm = this;
				vm.activeModule = 'login';
				vm.title = "Para Reservar debes iniciar sesión.";

				vm.isModal = $state.current.name === 'login' ? false : true;

				vm.setActiveModule = (module) =>{
					vm.activeModule = module;
					switch (module) {
						case "login":
							vm.register = true;
							break;
						case "register":
							vm.login = true;
							break;
						case "recover":
							vm.login = true;
							vm.register = true;
							break;
					}
				};

				vm.closeModal = () => {
					$rootScope.$broadcast('AuthForm.close');
				};

				$rootScope.$on('AuthForm.setOptions', (e, options) => {
					console.log(options);
					angular.extend(vm, options);
					if (options.title && options.title !== '') {
						$rootScope.$broadcast('loginForm.setOptions', {title: options.title});
					}
				});

			}
		};
	});
};
