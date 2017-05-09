export default ngModule => {
  require('./config/routes')(ngModule);
  require('./config/api_routes')(ngModule);
  require('./config/config')(ngModule);
};
