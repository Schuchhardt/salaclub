export default ngModule => {
  require('./services/authService')(ngModule);
  require('./services/commonService')(ngModule);
  require('./services/storageService')(ngModule);
  require('./services/cypherService')(ngModule);
  require('./services/recintoService')(ngModule);
  require('./services/userService')(ngModule);
};
