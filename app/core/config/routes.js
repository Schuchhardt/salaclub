export default ngModule => {
	ngModule.config(
		($stateProvider, $urlRouterProvider) => {
			$urlRouterProvider.otherwise('/home/salas');

			$stateProvider
			
			// LOGIN
			.state('login', {
				url: '/login',
				controller: 'LoginCtrl',
				controllerAs: 'login',
				template: require('../views/login/login.jade'),
			})

			// RECOVER
			.state('recover', {
				url: '/recover',
				controller: 'LoginCtrl',
				controllerAs: 'recover',
				template: require('../views/login/recover.jade'),
			})
			// REGISTER
			.state('register', {
				url: '/register',
				controller: 'RegisterCtrl',
				controllerAs: 'register',
				template: require('../views/register/register.jade'),
			})
			// HOME-TABS
			.state('home', {
				url: '/home',
				abstract: true,
				template: require('../views/common/home-tabs.jade'),
			})

			// PARTIDOS
			.state('home.partidos', {
				url: '/ensayos',
				views: {
					'tab_partidos': {
						template: require('../views/partidos/partidos.jade'),
						controller: 'PartidosCtrl',
						controllerAs: 'partidos',
					}
				}
			})

			// PARTIDO (DETALLE)
			.state('partido', {
				url: '/ensayo/:partidoId',
				controller: 'PartidosCtrl',
				controllerAs: 'partido',
				template: require('../views/partidos/partido.jade'),
			})

			// RECINTOS
			.state('home.recintos', {
				url: '/salas',
				views: {
					'tab_recintos': {
						template: require('../views/recintos/recintos.jade'),
						controller: 'RecintosCtrl',
						controllerAs: 'recintos',
					}
				}
			})
			
			// RECINTO (DETALLE)
			.state('recinto', {
				url: '/sala/:recintoId',
				controller: 'RecintosCtrl',
				controllerAs: 'recinto',
				template: require('../views/recintos/recinto.jade'),
			})

			// ARRIENDO RECINTO
			.state('arriendo', {
				url: '/arriendo/:recintoId',
				controller: 'ArriendoCtrl',
				controllerAs: 'arriendo',
				template: require('../views/arriendo/arriendo.jade'),
			})

			// COMPROBANTE DE RESERVA/ARRIENDO
			.state('resumen', {
				url: '/resumen/:reservaId?:success',
				controller: 'ArriendoCtrl',
				controllerAs: 'resumen',
				template: require('../views/arriendo/resumen.jade'),
			})

			// MI CUENTA
			.state('home.micuenta', {
				url: '/mi-cuenta',
				views: {
					'tab_micuenta': {
						template: require('../views/micuenta/micuenta.jade'),
						controller: 'MiCuentaCtrl',
						controllerAs: 'micuenta',
					}
				}
			})
			
			// TERMINOS Y CONDICIONES
			.state('terminos', {
				url: '/terminos',
				controller: 'MiCuentaCtrl',
				controllerAs: 'micuenta',
				template: require('../views/micuenta/terminos.jade'),
			})

			// PERFIL
			.state('perfil', {
				url: '/perfil',
				controller: 'PerfilCtrl',
				controllerAs: 'perfil',
				template: require('../views/perfil/perfil.jade'),
			})

			// REGISTER
			.state('editar_perfil', {
				url: '/editar_perfil',
				controller: 'EditarPerfilCtrl',
				controllerAs: 'perfil',
				template: require('../views/perfil/editar_perfil.jade'),
			})
			;
		}
	);
};
