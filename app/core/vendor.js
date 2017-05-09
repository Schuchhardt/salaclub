// Requerir/importar aquí las librerías (fonts, css, js)
// de uso común en todo el proyecto.

module.exports = () => {
	/* Styles */
	require('./vendor/ionic/css/ionic.css');
	require('leaflet/dist/leaflet.css');
	require('../styles/main.scss');
	/* JS */
	global._ = global._ = require('lodash');
	require('./vendor/ionic/js/ionic.bundle.js');
	require('./vendor/angular-locale_es-cl.js');
	require('./vendor/ng-rut.js');
	require('leaflet');
	require('./vendor/Google-tile.js');
	require('angular-leaflet-directive');
	require('ionic-datepicker');
	require('clipboard');
	require('ngclipboard/dist/ngclipboard.min.js');
	require('angular-file-upload');
  	require('angulartics');
  	require('angulartics-google-analytics');

};
