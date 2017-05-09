export default ngModule => {
	ngModule.controller('RecintosCtrl', function RecintosCtrl ($state, $scope, $stateParams, StorageService, RecintoService, $ionicScrollDelegate, $timeout, CommonService, $ionicModal, UserService, $window, $rootScope) {
		const STGO_COORDINATES = {lat: -33.4378305, lng: -70.65044920000003};
		const vm = this;
		const customIcon = {
			iconUrl: require('../../../images/icon-map-marker.png'),
			iconSize: [52, 69],
			iconAnchor: [22, 74],
		};
		const personIcon = {
			iconUrl: require('../../../images/icon-user-marker.png'),
			iconSize: [52, 69],
			iconAnchor: [22, 74],
		};

		const loadRecintos = (position) => {
			vm.loading = true;
			RecintoService.getAllRecintos(position).then( (response) =>{
				vm.allRecintos = _.orderBy(response.locals, 'created_at', 'desc');
				const formattedMarkers = {};
				const recintosConMarkers = _.filter(vm.allRecintos, (p) => {
					return p.latitude && p.longitude;
				});
				angular.forEach(_.uniqBy(recintosConMarkers, 'latitude'), (marker, index) => {
					formattedMarkers['m' + index] = {lat: marker.latitude, lng: marker.longitude, icon: customIcon, message: marker.name};
				});

				if (position) {
					formattedMarkers['m' + (recintosConMarkers.length)] = {lat: position.lat, lng: position.lon, icon: personIcon, message: "Posición actual"};
					vm.allRecintos = _.orderBy(response.locals, 'distance', 'asc');
				}
				if (recintosConMarkers.length > 0) {
					$scope.markers = formattedMarkers;
					if (position) {
						$scope.santiago = {lat: position.lat, lng: position.lon, zoom: 12};
					} else {
						$scope.santiago = {lat: $scope.markers.m0.lat, lng: $scope.markers.m0.lng, zoom: 11};
					}
				}
				vm.loading = false;
			}, (error) => {
				vm.loading = false;
				console.log(error);
			});
		};

		const loadRecinto = (recintoId) =>{
			RecintoService.getRecinto(recintoId).then( (response) => {
				vm.currentRecinto = response.local;
				vm.comments = _.sortBy(response.comments, 'created_at', true);
				vm.currentSlug = `${response.local.name.toLowerCase().replace(/\ /g, "_")}_${response.local.id}`;
				vm.extras = response.extras;
				vm.fields = response.fields;
				if (response.gallery.length > 0) {
					vm.gallery = response.gallery;
				} else {
					vm.gallery = [{ src: response.local.img_original_url || "https://s3-sa-east-1.amazonaws.com/balompie.cl/images/canchaExample.png"}];
				}
				if ($scope.slider) {
					$scope.slider.updateLoop();
					$timeout(() => {
						$scope.slider.startAutoplay();
					}, 1000);
				}
			}, (error) => {
				console.log(error);
			});
		};

		const loadMessageModal = () => {
			$ionicModal.fromTemplateUrl('message-modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				vm.modalRef = modal;
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

		const loadCommentModal = () => {
			$ionicModal.fromTemplateUrl('comment-modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				vm.commentModalRef = modal;
			});
		};

		const validarForm = (form) => {
			angular.forEach(form.$error.required, (field) => {
				field.$setDirty();
			});
			return form.$valid;
		};

		vm.currentTab = 2;
		vm.showSlider = true;
		vm.currentItem = 1;
		vm.sendingMessage = false;
		vm.currentPosition = false;
		vm.loading = true;

		vm.setCurrentTab = (tab) => {
			vm.currentTab = tab;
			if (tab === 1) {
				vm.allRecintos = _.orderBy(vm.allRecintos, 'created_at', 'desc');
			}
			if (tab === 3) {
				vm.allRecintos = _.orderBy(vm.allRecintos, 'ranking', 'desc');
			}
		};

		vm.setCurrentItem = (option) => {
			vm.currentItem = option;
		};

		vm.goToRecinto = (recinto) =>{
			$state.go('recinto', {recintoId: `${recinto.slug}_${recinto.id}`});
		};

		vm.goToRent = () =>{
			$state.go('arriendo', {recintoId: $stateParams.recintoId});
		};

		vm.replaceMode = (mode) => {
			return mode.replace(' ', '').replace(/\w*\ *\(/, '').replace(')', '');
		};

		vm.isFavorite = (recinto) => {
			const currentUser = StorageService.getObject('currentUser');
			return _.includes(currentUser.favorites || [], recinto.id);
		};

		vm.getBg = (img) => {
			return {"background-image": `url(${img.src})`};
		};


		vm.goToAddress = (recinto) => {
			$window.open("http://maps.google.com/?q=" + encodeURI(`${recinto.street_name} ${recinto.street_number} , ${recinto.commune_name}`), '_blank');
		};

		vm.openMessageModal = () => {
			vm.modalRef.show();
		};

		vm.closeModal = () => {
			vm.modalRef.hide();
		};

		vm.closeAuthModal = () => {
			if (vm.authModalRef && vm.authModalRef.isShown()) vm.authModalRef.hide();
		};

		vm.openCommentModal = () => {
			const currentUser = StorageService.getObject('currentUser', null);
			if (currentUser) {
				vm.commentModalRef.show();
			} else {
				$rootScope.$broadcast( 'AuthForm.setOptions', {
					title: "Para Ingresar una calificación debes estar registrado",
					activeModule: 'login',
					register: true
				});
				vm.authModalRef.show();
			}
		};

		$scope.setRanking = (points) => {
			$scope.newComment.ranking = points;
		};

		$scope.closeCommentModal = () => {
			vm.commentModalRef.hide();
		};

		// Message Modal
		$scope.closeModal = () => {
			vm.modalRef.hide();
		};
		$scope.alertMessage = {};
		$scope.contact = {};
		$scope.newComment = {points: 0};

		$scope.sliderOptions = {
			autoplay: true,
			loop: false,
			effect: 'fade',
			speed: 5000,
		};

		$scope.hasError = (formName) => {
			return formName.$dirty && formName.$invalid;
		};

		$scope.isOk = (formName) => {
			return formName.$dirty && formName.$valid;
		};

		$scope.createComment = (comment, form) => {
			if ( validarForm(form) && vm.sendingMessage === false) {
				vm.sendingMessage = true;
				const currentUser = StorageService.getObject('currentUser', null);
				UserService.setRanking({local_id: _.last($stateParams.recintoId.split("_")), user_id: currentUser.user.id, points: comment.ranking, text: comment.text}).then( (response) => {
					vm.sendingMessage = false;
					console.log(response);
					vm.comments = _.sortBy(response.comments, 'created_at', true);
					$scope.closeCommentModal();
				});
			}
		};

		$scope.sendMessage = (userMessage, form) => {
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
				}, () => {
					$scope.alertMessage = {text: "Ha ocurrido un error, por favor intentalo más tarde.", isOk: false, show: true};
					$timeout(() => {
						vm.sendingMessage = false;
						$scope.alertMessage.show = false;
						$scope.closeModal();
					}, 4000);
				});
			}
		};

		$scope.$on("$ionicSlides.sliderInitialized", (event, data) => {
			$scope.slider = data.slider;
		});

		$scope.$on('leafletDirectiveMarker.click', (evnt, args) => {
			$scope.santiago.lat = args.model.lat;
			$scope.santiago.lng = args.model.lng;
		});

		$scope.$on('$ionicView.beforeEnter', () => {
			if ($state.current.name === 'recinto') {
				vm.currentUrl = window.location.href.toString(); 
				$timeout(() => {
					loadRecinto(_.last($stateParams.recintoId.split("_")));
				}, 500);
				loadMessageModal();
				loadAuthModal();
				loadCommentModal();
			} else {
					if (navigator.geolocation && vm.currentPosition === false) {
						navigator.geolocation.getCurrentPosition((position) => {
							if (vm.currentPosition !== {lat: position.coords.latitude, lon: position.coords.longitude}) {
								vm.currentPosition = {lat: position.coords.latitude, lon: position.coords.longitude};
								loadRecintos(vm.currentPosition);
							}
						}, (error) => {
							console.log(error);
							loadRecintos();
						});
					} else {
						loadRecintos();
					}
			}
			const currentUser = StorageService.getObject('currentUser', false);
			vm.isGuest = currentUser ? false : true;
		});

		$rootScope.$on('AuthForm.close', () => {
			vm.closeAuthModal();
		});

		$rootScope.$on('userLogged', () => {
			vm.closeAuthModal();
		});

		angular.extend($scope, {
			santiago: {
				lat: STGO_COORDINATES.lat,
				lng: STGO_COORDINATES.lng,
				zoom: 12
			},
			markers: {
				m1: {
					name: "Balompie",
					lat: STGO_COORDINATES.lat,
					lng: STGO_COORDINATES.lng,
					icon: customIcon,
				},
			},
			layers: {
				baselayers: {
					googleTerrain: {
						name: 'Google Terrain',
						layerType: 'TERRAIN',
						type: 'google'
					},
					googleRoadmap: {
						name: 'Google Streets',
						layerType: 'ROADMAP',
						type: 'google'
					}
				}
			},
			options: {
				scrollWheelZoom: false,
				zoomControl: true,
				zoomControlPosition: 'topright',
				maxZoom: 15,
				minZoom: 6,
				tap: true
			}
		});
	});
};
