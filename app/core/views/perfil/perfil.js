export default ngModule => {
	ngModule.controller('PerfilCtrl', function PerfilCtrl ($state, StorageService, $scope, AuthService) {
		const vm = this;

		const loadUser = () => {
			AuthService.getCurrentUser().then( (response) => {
				vm.user = response.user;
			});
		};

		$scope.$on("$ionicView.beforeEnter", () => {
			const currentUser = StorageService.getObject('currentUser', false);
			if (currentUser) {
				vm.user = angular.copy(currentUser.user);
				loadUser();
			} else {
				$state.go('login');
			}
		});

		vm.goEditProfile = () => {
			$state.go('editar_perfil');
		};

	});
};
