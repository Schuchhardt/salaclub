export default ngModule => {
	ngModule.controller('PartidosCtrl', function PartidosCtrl($scope, $state, $stateParams, UserService, StorageService, $window, $ionicPopup) {

		const vm = this;
        const customIcon = {
            iconUrl: require('../../../images/icon-map-marker.png'),
            iconSize: [52, 69],
            iconAnchor: [22, 94],
        };

        const loadReservas = (userId) => {
            UserService.getReservations(userId).then( (response) => {
                vm.proxPartidos = _.orderBy(response.reservations, (partido) => { return partido.reservation.start_time; });
                const formattedMarkers = {};
                const partidosConMarkers = _.filter(_.map(vm.proxPartidos, 'local'), (p) => {
                    return p.latitude && p.longitude;
                });
                angular.forEach(_.uniqBy(partidosConMarkers, 'latitude'), (marker, index) => {
                    formattedMarkers['m' + index] = {lat: marker.latitude, lng: marker.longitude, icon: customIcon};
                });
                if (partidosConMarkers.length > 0) {
                    $scope.markers = formattedMarkers;
                    $scope.santiago = {lat: $scope.markers.m0.lat, lng: $scope.markers.m0.lng, zoom: 12};
                }
            }, (error) => {
                console.log(error);
            });
        };

        const loadReserva = (reservationId) => {
            UserService.getReservation(reservationId).then( (response) => {
                vm.recinto = response.local;
                vm.reservation = response.reservation;
                vm.field = response.field;
                const formattedMarkers = {
                    m0: {lat: response.local.latitude, lng: response.local.longitude, icon: customIcon}
                };
                $scope.marker = response.local.latitude && response.local.longitude ? formattedMarkers : null;
                $scope.santiago = {lat: response.local.latitude, lng: response.local.longitude, zoom: 12};
            }, (error) => {
                console.log(error);
            });
        };

        const showMessage = (message, success = false) => {
            const showSuccess = $ionicPopup.alert({
                cssClass: 'success-register',
                title: success ? 'Partido Cancelado' : 'Cancelar Partido',
                okType: 'primary-btn',
                template: message
            });
            showSuccess.then( () => {
                if (success) {
                    $state.go('home.partidos');
                }
            });
        };

        vm.replaceMode = (mode) => {
            return mode.replace(' ', '').replace(/\w*\ *\(/, '').replace(')', '');
        };

        vm.goToPartido = (partido) =>{
            $state.go('partido', {partidoId: partido.reservation.id});
        };

        vm.cancelReservation = () => {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cancelar Ensayo',
                template: '¿Estás seguro que deseas cancelar el ensayo?',
                okText: 'Sí, Cancelar',
                okType: 'secondary-btn cancel',
                cancelText: 'No',
                cancelType: 'secondary-btn no',
                cssClass: 'confirm-cancel success-register'
            });

            confirmPopup.then((res) => {
                if (res) {
                    UserService.cancelReservation($stateParams.partidoId).then( (response) => {
                        console.log(response);
                        if (response.success === true) {
                            showMessage(response.message, true);
                        } else {
                            showMessage(response.message);    
                        }
                    }, (error) => {
                        console.log(error);
                        showMessage(error);
                    });
                }
            });
        };

        vm.goToResumen = () => {
            $state.go('resumen', {reservaId: $stateParams.partidoId});
        };

        vm.goToAddress = (recinto) => {
            $window.open("https://maps.google.com/?q=" + encodeURI(`${recinto.street_name} ${recinto.street_number} , ${recinto.commune_name}`), '_blank');
        };

		$scope.$on('leafletDirectiveMarker.click', (evnt, args) => {
			$scope.santiago.lat = args.model.lat;
			$scope.santiago.lng = args.model.lng;
		});

        $scope.$on('$ionicView.beforeEnter', () => {
            const currentUser = StorageService.getObject('currentUser', false);
            vm.currentUser = currentUser;
            if ($state.current.name === 'partido') {
                loadReserva($stateParams.partidoId);
            } else {
                if (currentUser) {
                    loadReservas(currentUser.user.id);
                }
            }
        });

        angular.extend($scope, {
            santiago: {
                lat: -33.4378305,
                lng: -70.65044920000003,
                zoom: 12
            },
            markers: {
                m0: {
                    name: "Cancha 1",
                    lat: -33.4378305,
                    lng: -70.65044920000003,
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
                scroll: false,
                zoomControl: false,
            }
        });

	});
};
