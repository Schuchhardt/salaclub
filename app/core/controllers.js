export default ngModule => {
	require('./views/login/login')(ngModule);
	require('./views/register/register')(ngModule);
	require('./views/partidos/partidos')(ngModule);
	require('./views/recintos/recintos')(ngModule);
	require('./views/arriendo/arriendo')(ngModule);
	require('./views/micuenta/micuenta')(ngModule);
	require('./views/perfil/perfil')(ngModule);
	require('./views/perfil/editar_perfil')(ngModule);
};
