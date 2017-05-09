require('./vendor')();

const ngModules = [
	'ionic',
	'ngSanitize',
	'ionic-datepicker',
	'leaflet-directive',
	'ngclipboard',
	'angularFileUpload',
	'ngRut',
  	'angulartics',
  	'angulartics.google.analytics'
];

const ngModule = angular.module('ensayapp', ngModules);

require('./config')(ngModule);
require('./services')(ngModule);
require('./directives')(ngModule);
require('./controllers')(ngModule);


ngModule.run(($ionicPlatform, CONFIG) => {
	$ionicPlatform.ready(() => {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			window.StatusBar.styleDefault();
		}
	});
	if (CONFIG.devEnv === false && location.protocol !== 'https:' && window.location.host === 'ensayapp.cl') {
		location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
	}
});

ngModule.config( ($ionicConfigProvider, ionicDatePickerProvider, $logProvider) => {
	$ionicConfigProvider.views.transition('android');
	$ionicConfigProvider.tabs.style('standard').position('top');
	$ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');

	ionicDatePickerProvider.configDatePicker({
		inputDate: new Date(),
		titleLabel: 'Seleccione Fecha',
		setLabel: 'Elegir',
		todayLabel: 'Hoy',
		closeLabel: 'Cerrar',
		mondayFirst: false,
		weeksList: ["D", "L", "M", "M", "J", "V", "S"],
		monthsList: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"],
		templateType: 'popup',
		from: new Date(1960, 1, 1),
		to: new Date(),
		showTodayButton: false,
		dateFormat: 'dd/MMMM/yyyy',
		closeOnSelect: true,
		disableWeekdays: []
	});
    $logProvider.debugEnabled(false);

});

/* eslint-disable */
(((i, s, o, g, r, a, m) => {
  i.GoogleAnalyticsObject = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments);
  };
  i[r].l = 1 * new Date();
  a = s.createElement(o);
  m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
}))(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

// ga('create', 'UA-XXXXXXX-1', 'auto');
// ga('send', 'pageview');
/* eslint-enable */

