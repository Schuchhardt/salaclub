export default ngModule => {

	ngModule.directive('registerForm', function registerForm(AuthService, CommonService, $timeout, StorageService, $state, $ionicPopup, $ionicLoading, $rootScope, ionicDatePicker, FileUploader, CONFIG, API_ROUTES) {
		return {
			template: require('./register-form.jade'),
			restrict: "E",
			transclude: true,
			controllerAs: 'register',
			controller: function RegisterFormCtrl() {
				const vm = this;
				vm.activeModule = 'register';
				vm.title = "Para Reservar debes iniciar sesión.";
				vm.isModal = $state.current.name === 'register' ? false : true;
				vm.uploader = new FileUploader({autoUpload: false});
				vm.newUser = {};
				vm.errorMessage = {show: false};

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

		        const showSuccessMessage = () => {
					const showSuccess = $ionicPopup.alert({
						cssClass: 'success-register',
						title: 'Usuario Creado!',
						okType: 'primary-btn',
						template: 'El usuario ha sido creado. Para ingresar a tu cuenta debes confirmar tu correo con el link que envíamos.'
					});
					showSuccess.then( () => {
						if (vm.isModal) {
							$rootScope.$broadcast('userLogged');
						} else {
							$state.go('login');
						}
					});
		        };

				const loadRegions = () => {
					CommonService.getRegions().then( (response) => {
						vm.regions = response.regions;
					});
				};

				vm.createUser = (newUser, form) => {
					if (validateForm(form)) {
						if (newUser.password === newUser.password2) {
							$ionicLoading.show({template: require('../../common/loading.jade')});
							AuthService.register(newUser).then( (response) =>{
								$ionicLoading.hide();
								StorageService.setObject('currentUser', response.user);
								const imageUrl =  CONFIG.apiBaseUrl + API_ROUTES.users + 'image/' + response.user.id;
						        vm.uploader.url = imageUrl;
						        if (vm.uploader.queue.length > 0) {
						          _.last(vm.uploader.queue).url = imageUrl;
						          _.last(vm.uploader.queue).removeAfterUpload = true;
						          vm.uploader.uploadAll();
						        } else {
						        	showSuccessMessage();
						        }
							}, (error) => {
								$ionicLoading.hide();
								let errorMessage = "Ha ocurrido un error";
								if (error.error === true && error.message.email) {
									errorMessage = "El correo ya está registrado. Inicia sesión o Recupera tu contraseña.";
								}
								if (error.error === true && error.message.rut) {
									errorMessage = "El RUT ya está registrado. Inicia sesión o Recupera tu contraseña.";
								}
								showErrorMessage(errorMessage);
							});
						} else {
							showErrorMessage("Las contraseñas no coinciden");
						}
					}
				};


				vm.loadRegionDetail = (regionId) => {
					CommonService.getRegionDetail(regionId).then( (response) => {
						vm.communes = _.sortBy(response.communes, 'name');
					});
				};

		    	vm.openDatepicker = () => {
		      		ionicDatePicker.openDatePicker({
				      	callback: (val) => {
				        	vm.newUser.birthday = new Date(val);
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

				vm.setActiveModule = (module) =>{
					vm.activeModule = module;
				};

				vm.closeModal = () => {
					$rootScope.$broadcast('loginModal.close');
				};

				$rootScope.$on('registerForm.setOptions', (e, options) => {
					angular.extend(vm, options);
				});

				loadRegions();

			}
		};
	});
};
