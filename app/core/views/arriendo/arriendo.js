export default ngModule => {
	ngModule.controller('ArriendoCtrl', function ArriendoCtrl ($state, RecintoService, $scope, $stateParams, ionicDatePicker, StorageService, UserService, $ionicModal, $window, CONFIG, $timeout, $ionicScrollDelegate, $ionicPopup, $ionicLoading, $rootScope) {
		const vm = this;
		const currentUser = StorageService.getObject('currentUser', false);

		const sliceEach = (array, dividedFor) =>{
			let counter = 0;
			let subsArrays = [];
			const transformedArray = [];
			
			angular.forEach(array, (ar) => {
				counter += 1;
				subsArrays.push(ar);
				if ( (counter % dividedFor) === 0) {
					transformedArray.push(subsArrays);
					subsArrays = [];
				}
			});

			if (subsArrays.length > 0) {
				transformedArray.push(subsArrays);
			}
			return transformedArray;
		};

		const loadRecinto = (recintoId) => {
			RecintoService.getRecinto(recintoId).then( (response) => {
				vm.currentRecinto = response.local;
				vm.extras = response.extras;
				vm.fields = response.fields;
				vm.fieldsInFour = sliceEach(_.orderBy(response.fields, 'number'), 4);
				console.log(vm.fieldsInFour);
				// vm.horas = false;
			}, (error) => {
				console.log(error);
			});
		};

        const loadReserva = (reservationId) => {
            UserService.getReservation(reservationId).then( (response) => {
                vm.local = response.local;
                vm.reservation = response.reservation;
                vm.field = response.field;
            }, (error) => {
                console.log(error);
            });
        };

		const loadAuthModal = () => {
			$ionicModal.fromTemplateUrl('auth-modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				vm.authModalRef = modal;
			});
		};

		const getDaysBetweenDates = (end, dayIndex) => {
			const result = [];
			const current = new Date();

			current.setDate(current.getDate() + (dayIndex - current.getDay() + 7) % 7);
			current.setHours(0, 0, 0, 0);
			while (current < end) {
				result.push(new Date(+current));
				current.setDate(current.getDate() + 7);
			}
			return result;
		};

		const getDisabledDates = (untilDate, recinto) => {
			const allDays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"];
			const disabledDays = [];

			angular.forEach(allDays, (day, index) => {
				if (recinto.local_schedule && !_.includes(recinto.local_schedule.days.split(" "), day)) {
					disabledDays.push(getDaysBetweenDates(untilDate, index));
				}
			});
			return _.flatten(disabledDays);
		};

		vm.currentUser = currentUser ? currentUser.user : currentUser;
		vm.showTooltip = false;

		vm.setCurrentStep = (option) => {
			vm.currentStep = option;
			$ionicScrollDelegate.scrollTop();
		};

		vm.setCurrentItem = (option) => {
			vm.currentItem = option;
		};

		vm.goBack = (target) => {
			$state.go(target, {recintoId: $stateParams.recintoId});
		};

		vm.goToMatch = () => {
			$state.go('partido', {partidoId: $stateParams.reservaId});	
		};

		vm.replaceMode = (mode) => {
			return mode.replace(' ', '').replace(/\w*\ *\(/, '').replace(')', '');
		};

		vm.selectField = (field) => {
			vm.selectedField = field;
			vm.selectedPrice = field.price || 25000;
		};

    	vm.openDatepicker = () => {
			const today = new Date();
			const aMonth = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000));

      		ionicDatePicker.openDatePicker({
		      	callback: (val) => {
		        	vm.selectedDate = new Date(val);
					RecintoService.getScheduleByDate(_.last($stateParams.recintoId.split("_")), val).then( (response) => {
						const hoursWithFields = [];
						angular.forEach(response.schedule, (schedule, hour) =>{
							hoursWithFields.push({
								inicio: hour,
								termino: `${parseInt(hour.split(":")[0], 10) + 1}:00`,
								fields: sliceEach(_.orderBy(schedule, 'number'), 4)
							});
						});
						if (hoursWithFields.length > 0) {
							vm.horas = _.orderBy(hoursWithFields, 'inicio').reverse();
						} else {
							vm.horas = false;
						}
					});
		      	},
		      	from: today,
		      	to: aMonth,
		      	mondayFirst: true,
		      	closeOnSelect: true,
		      	templateType: 'popup',
		      	disabledDates: getDisabledDates(aMonth, vm.currentRecinto)
		    });
    	};

    	vm.subtotal = () => {
    		let finalPrice = 0;
    		let extraPrice = 0;
    		if (vm.paymentMethod && vm.selectedPrice) {
	    		const selectedExtras = _.filter(vm.extras, {selected: true});
	    		finalPrice = vm.paymentMethod === 2 ? (parseInt(vm.selectedPrice) / 2) : parseInt(vm.selectedPrice);
				if (selectedExtras.length > 0) {
					extraPrice = _.reduce(selectedExtras, (aux, extra) => {
						return aux + extra.price;
					}, 0);
				}
    		}
			return finalPrice + extraPrice;
    	};

    	vm.recargo = () => {
    		let recargoFinal = 0;
    		if (vm.paymentMethod && vm.paymentMethod !== 3) {
    			recargoFinal = vm.subtotal() !== 0 ? ( vm.subtotal() / 100 ) * 3 : 0;
    		}
    		return parseInt(recargoFinal);
    	};

		vm.isSelected = (hora, dia) => {
			return angular.equals({hora: hora, dia: dia}, vm.horaSeleccionada);
		};

	    vm.postTo = (social) => {
	      let url;
	      $timeout( () => {
	        switch (social) {
	        case 1:
	          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vm.shareUrl)}`;
	          $window.open(url, 'Facebook', 'status = 1, left = 350, top = 90, height = 350, width = 420, resizable = 0');
	          break;
	        case 2:
	          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Reserva realizada, Ve los detalles del ensayo en ' + vm.shareUrl)}&hashtags=futbol,chile&url=ensayapp.cl`;
			  $window.open(url, 'Twitter', 'status = 1, left = 350, top = 90, height = 350, width = 420, resizable = 0');
	          break;
	        case 3:
	          url = `https://plus.google.com/share?url=${encodeURIComponent(vm.shareUrl)}`;
	          $window.open(url, 'Google +', 'status = 1, left = 350, top = 90, height = 350, width = 420, resizable = 0');
	          break;
	        case 4:
			  url = `mailto:?subject=${encodeURIComponent("Nueva Reserva en EnsayApp.cl")}&body=${encodeURIComponent("Reserva realizada, Ve los detalles del ensayo en " + vm.shareUrl)}`;
			  $window.location = url;
	          break;
	        case 5:
	          url = `whatsapp://send?text=${encodeURIComponent("Reserva realizada, Ve los detalles del ensayo en " + vm.shareUrl)}`;
	          $window.location = url;
	          break;
	        }
	      }, 500);
	    };

	    vm.copyLink = () => {
	    	vm.showTooltip = true;
	    	$timeout(() => {
	    		vm.showTooltip = false;
	    	}, 2000);
	    };

		vm.closeAuthModal = () => {
			// if (vm.authModalRef.isShown()) vm.authModalRef.hide();
			vm.authModalRef.hide();
		};

		vm.goToPay = (isGuest) => {
			if (!vm.currentUser && !isGuest) {
				$rootScope.$broadcast( 'AuthForm.setOptions', {
					title: "Para Reservar debes iniciar sesión.",
					activeModule: 'login',
					register: true,
					enterAsGuest: true,
				});
				return vm.authModalRef.show();
			}
			const selectedExtras = _.filter(vm.extras, {selected: true});
			const startTime = vm.selectedDate.setHours(parseInt(vm.selectedHour.inicio.split(':')[0], 10));
			const finalTime = vm.selectedDate.setHours(parseInt(vm.selectedHour.termino.split(':')[0], 10));
			const order = {
				"field_id": vm.selectedField.id,
				"user_id": vm.currentUser.id,
				"comment": vm.reserveComment,
				"start_time": new Date(startTime),
				"final_time": new Date(finalTime),
				"extras": selectedExtras.length > 0 ? selectedExtras : null,
				"price": ( vm.subtotal() ) + ( vm.recargo() ),
				"reservation_method": vm.paymentMethod,
				"is_guest": isGuest || false,
				"guest_info": StorageService.getObject('guestInfo')
			};
			$ionicLoading.show({template: require('../common/loading.jade') });
			RecintoService.reservarCancha(order).then( (response) =>{
				if (vm.paymentMethod === 3) {
					$state.go('resumen', {reservaId: response.reservation.id, success: true});
				} else {
					$window.location.href = `${CONFIG.baseUrl}pay/${response.reservation.id}`;
				}
				$ionicLoading.hide();
			}, (error) =>{
				console.log(error);
				$ionicLoading.hide();
				if (error.status === 403) {
					const alert = $ionicPopup.alert({
						title: 'Sala no disponible',
						template: 'Lo sentimos pero la hora seleccionada ya no está disponible, intenta en otro horario o sala',
						cssClass: "reservation-not-available",
						okType: 'secondary-btn',
						okText: 'Volver'
					});

					alert.then( () =>{
						vm.setCurrentStep(1);
					});
				}
			});
		};

		$scope.$on('$ionicView.beforeEnter', () => {
			if ($state.current.name === 'resumen') {
				loadReserva($stateParams.reservaId);
				vm.shareUrl = `http://ensayapp.cl/#/ensayo/${$stateParams.reservaId}`;
				vm.isSuccess = $stateParams.success ? true : false;
				vm.isMobile = ionic.Platform.isIOS() || ionic.Platform.isAndroid();
			} else {
				$ionicScrollDelegate.scrollTop();
				loadAuthModal();
				const recintoId = _.last($stateParams.recintoId.split("_"));
				vm.currentRecinto = {
					id: recintoId,
					name: $stateParams.recintoId.replace(recintoId, '').replace(/\_/g, ' ')
				};
				loadRecinto(recintoId);
				vm.selectedDate = false;
				vm.selectedHour = false;
				vm.selectedField = false;
				vm.selectedPrice = false;
				vm.currentStep = 1;
				vm.currentItem = 1;
				vm.showExtras = false;
				vm.isSuccess = false;
			}
		});

		$scope.$on('userLogged', () => {
			const loggedUser =  StorageService.getObject('currentUser', false);
			vm.currentUser = loggedUser ? loggedUser.user : loggedUser;
			vm.closeAuthModal();
			vm.goToPay();
		});

		$rootScope.$on('AuthForm.close', () => {
			vm.closeAuthModal();
		});

		$rootScope.$on('guestOk', () => {
			vm.closeAuthModal();
			vm.goToPay(true);
		});

	});
};
