export default ngModule => {

	ngModule.directive('recoverForm', function recoverForm(AuthService, $timeout, $state, $ionicPopup, $ionicLoading, $rootScope) {
		return {
			template: require('./recover-form.jade'),
			restrict: "E",
			transclude: true,
			controllerAs: 'recover',
			controller: function RecoverFormCtrl() {
				const vm = this;
				vm.activeModule = 'recover';

				vm.isModal = $state.current.name === 'login' ? false : true;

				vm.errorMessage = {show: false};

		        vm.recoverPass = (user) => {
					if (vm.loading === true) return false;

					vm.loading = true;
					$ionicLoading.show({template: require('../../common/loading.jade')});

					AuthService.resetPassword(user).then( () => {
						vm.loading = false;
						$ionicLoading.hide();
						const showSuccess = $ionicPopup.alert({
							cssClass: 'success-register',
							title: 'Recuperación de Contraseña',
							template: 'Se ha enviado un correo con las instrucciones de recuperación.'
						});
						showSuccess.then( () => {
							if (vm.isModal) {
								$rootScope.$broadcast('userLogged');
							} else {
								$state.go('login');
							}
						});

					}, (error) =>{
						console.log(error);
						vm.loading = false;
						$ionicLoading.hide();
						vm.errorMessage = {show: true, msg: error.message};
						$timeout(function() {
							vm.errorMessage.show = false;
						}, 3000);
					});
				};

				vm.setActiveModule = (module) =>{
					vm.activeModule = module;
				};

				vm.closeModal = () => {
					$rootScope.$broadcast('loginModal.close');
				};

				$rootScope.$on('registerForm.setOptions', (e, options) => {
					angular.extend(vm, options);
				});

			}
		};
	});
};
