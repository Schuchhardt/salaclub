export default ngModule => {

	ngModule.directive('reservationGuest', function reservationGuest($rootScope, StorageService) {
		return {
			template: require('./reservation-guest.jade'),
			restrict: "E",
			transclude: true,
			controllerAs: 'guest',
			controller: function ReservationGuestFormCtrl() {
				const vm = this;
				vm.user = StorageService.getObject('guestInfo');

				vm.errorMessage = {show: false};

				const validateForm = (form) => {
		            angular.forEach(form.$error.required, (field) => {
		                field.$setDirty();
		            });
		            return form.$valid;
		        };

		        vm.enterAsGuest = (guestInfo, form) => {
		        	if (validateForm(form)) {
		        		StorageService.setObject('guestInfo', guestInfo);
		        		$rootScope.$broadcast("guestOk");
		        	}
		        };

			}
		};
	});
};
