export default ngModule => {
	ngModule.controller('MiCuentaCtrl', function MiCuentaCtrl ($scope, $state, StorageService, $ionicModal, CommonService, $timeout) {
		const vm = this;

		const loadMessageModal = () => {
			$ionicModal.fromTemplateUrl('message-modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				vm.modalRef = modal;
			});
		};

        const validarForm = (form) => {
            angular.forEach(form.$error.required, (field) => {
                field.$setDirty();
            });
            return form.$valid;
        };

		// Message Modal
		vm.sendingMessage = false;

		vm.logOut = () => {
			StorageService.clearAll();
			$state.go('login');
		};

		vm.openMessageModal = () => {
			vm.modalRef.show();
		};

		$scope.alertMessage = {};
		$scope.contact = {};

        $scope.closeModal = () =>{
        	vm.modalRef.hide();
        };

        $scope.hasError = (formName) => {
        	return formName.$dirty && formName.$invalid;
        };

        $scope.isOk = (formName) => {
        	return formName.$dirty && formName.$valid;
        };

		$scope.sendMessage = (userMessage, form) =>{
			if ( validarForm(form) && vm.sendingMessage === false) {
				vm.sendingMessage = true;
				CommonService.sendMessage(userMessage).then( () => {
					$scope.contact = {};
					form.$setPristine();
					$scope.alertMessage = {text: "Tu Mensaje ha sido enviado correctamente", isOk: true, show: true};
					$timeout(() => {
						vm.sendingMessage = false;
						$scope.alertMessage.show = false;
						$scope.closeModal();
					}, 4000);
				}, (error) => {
					console.info(error);
					$scope.alertMessage = {text: "Ha ocurrido un error, por favor intentalo más tarde.", isOk: false, show: true};
					$timeout(() => {
						vm.sendingMessage = false;
						$scope.alertMessage.show = false;
						$scope.closeModal();
					}, 4000);
				});
			}
		};

		$scope.$on('$ionicView.beforeEnter', () => {
			const currentUser = StorageService.getObject('currentUser', false);
			vm.isGuest = currentUser ? false : true;
			loadMessageModal();
		});


	});
};
