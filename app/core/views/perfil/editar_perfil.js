export default ngModule => {
	ngModule.controller('EditarPerfilCtrl', function EditarPerfilCtrl ($state, StorageService, $scope, AuthService, $ionicLoading, CommonService, $timeout, $ionicPopup, ionicDatePicker, FileUploader, CONFIG, API_ROUTES) {
		const vm = this;
		vm.errorMessage = {show: false};
    	vm.uploader = new FileUploader({autoUpload: false});

		const validateForm = (form) => {
            angular.forEach(form.$error.required, (field) => {
                field.$setDirty();
            });
            return form.$valid;
        };

        const showErrorMessage = (message) => {
			vm.errorMessage = {show: true, text: message};
			$timeout(() => {
				vm.errorMessage.show = false;
			}, 4000);
        };
        

		const loadRegions = () => {
			CommonService.getRegions().then( (response) => {
				vm.regions = response.regions;
				if (vm.currentUser.commune) {
					vm.loadRegionDetail(vm.currentUser.region, true);
				}
				if (vm.currentUser.region) {
					vm.currentUser.region = _.find(vm.regions, {id: vm.currentUser.region.id});
				}
			});
		};

		const loadUser = () => {
			AuthService.getCurrentUser().then( (response) => {
				vm.currentUser = response.user;
				loadRegions();
			});
		};

		const showSuccessMessage = () => {
			const showSuccess = $ionicPopup.alert({
				cssClass: 'success-register',
				title: 'Perfil actualizado!!',
				okType: 'primary-btn',
					template: 'El usuario ha sido actualizado éxitosamente.'
			});
			showSuccess.then( () => $state.go('perfil'));
		};

		vm.loadRegionDetail = (region, reload) => {
			CommonService.getRegionDetail(region.id).then( (response) => {
				vm.communes = response.communes;
				if (reload) {
					vm.currentUser.commune = _.find(vm.communes, {id: vm.currentUser.commune.id});
				}
			});
		};

		vm.updateUser = (user, updateForm) => {
			if (validateForm(updateForm)) {
				$ionicLoading.show({template: require('../common/loading.jade')});
				AuthService.update(user).then( () =>{
					const imageUrl =  CONFIG.apiBaseUrl + API_ROUTES.users + 'image/' + user.id;
			        vm.uploader.url = imageUrl;
			        if (vm.uploader.queue.length > 0) {
			          _.last(vm.uploader.queue).url = imageUrl;
			          _.last(vm.uploader.queue).removeAfterUpload = true;
			          vm.uploader.uploadAll();
			        } else {
			        	$ionicLoading.hide();
			        	showSuccessMessage();
			        }

				}, (error) => {
					console.log(error);
					$ionicLoading.hide();
					let errorMessage = "Ha ocurrido un error";
					if (error.error === true && error.message.email) {
						errorMessage = "El correo ya está registrado.";
					}
					if (error.error === true && error.message.rut) {
						errorMessage = "El RUT ya está registrado. Inicia sesión o Recupera tu contraseña.";
					}
					showErrorMessage(errorMessage);
				});
			
			}
		};

    	vm.openDatepicker = () => {
      		ionicDatePicker.openDatePicker({
      			inputDate: new Date(vm.currentUser.birthday),
		      	callback: (val) => {
		        	vm.currentUser.birthday = new Date(val);
		      	},
		      	from: new Date(1950, 1, 1),
		      	to: new Date(),
		      	mondayFirst: true,
		      	closeOnSelect: true,
		      	templateType: 'popup'
		    });
    	};

	    // CALLBACKS
	    vm.uploader.onAfterAddingAll = function(addedFileItems) {
	      	vm.newUserImage = addedFileItems[0];
	    };

	    vm.uploader.onCompleteAll = function() {
	        $ionicLoading.hide();
	        showSuccessMessage();
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


	});
};
