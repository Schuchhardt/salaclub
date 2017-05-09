export default ngModule => {
  ngModule.service('StorageService', ($q, $window, CypherService, CONFIG) => {

    const encrypt = (value) => {
      return angular.isString(value) && value !== "" ? CypherService.encode(CONFIG.secret, value) : value;
    };

    const decrypt = (value) => {
      return angular.isString(value) && value !== "" ? CypherService.decode(CONFIG.secret, value) : value;
    };

    const _toggleEncryption = (obj, reverse) => {
      _.each(obj, (value, key) => {
        if (reverse) {
          obj[decrypt(key)] = _.isObject(value) ? _toggleEncryption(value, reverse) : decrypt(value);
        } else {
          obj[encrypt(key)] = _.isObject(value) ? _toggleEncryption(value, reverse) : encrypt(value);
        }
        if (_.isString(key)) delete obj[key];
      });
      return obj;
    };

    const encryptObject = (obj) => {
      return _toggleEncryption(obj, false);
    };

    const decryptObject = (obj) => {
      return _toggleEncryption(obj, true);
    };

    const service = {
      set: (key, value) => {
        if (!_.isUndefined(key) && !_.isUndefined(value)) {
          $window.localStorage[encrypt(key)] = encrypt(value);
        }
        return true;
      },
      get: (key, defaultValue) => {
        const valueEncrypted = $window.localStorage[encrypt(key)];
        const isInt = parseInt(valueEncrypted);
        const isBoolean = _.contains(["true", "false"], valueEncrypted);
        let valueDecrypted;
        if (isInt) {
          valueDecrypted = valueEncrypted.indexOf(".") >= 0 ? parseFloat(valueEncrypted) : isInt;
        } else {
          if (isBoolean) {
            valueDecrypted = valueEncrypted === "true" ? true : false;
          } else {
            valueDecrypted = decrypt(valueEncrypted);
          }
        }
        return valueDecrypted || defaultValue;
      },
      setObject: (key, objectToSet) => {
        if (_.isEmpty(objectToSet)) {
          service.remove(key);
          return false;
        }
        $window.localStorage[encrypt(key)] = JSON.stringify(encryptObject(angular.copy(objectToSet)));
        return true;
      },
      getObject: (key, fallback = '{}' ) => {
        const objectEncrypted = JSON.parse(angular.copy($window.localStorage[encrypt(key)]) || fallback);
        return decryptObject(objectEncrypted);
      },
      remove: (key) => {
        if ( !$window.localStorage[encrypt(key)] ) return;
        $window.localStorage.removeItem(encrypt(key));
        return;
      },
      clearAll: () => {
        return $window.localStorage.clear();
      }
    };

    return service;
  });
};
