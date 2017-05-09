export default ngModule => {
	require('./views/components/auth-form/auth-form')(ngModule);
  require('./views/components/login-form/login-form')(ngModule);
  require('./views/components/register-form/register-form')(ngModule);
  require('./views/components/recover-form/recover-form')(ngModule);
  require('./views/components/reservation-guest/reservation-guest')(ngModule);
  require('./directives/err-src')(ngModule);
  require('./directives/ng-thumb')(ngModule);
  // require('./directives/ng-disqus')(ngModule);
};
