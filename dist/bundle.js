(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FacebookFactory = function () {
  function FacebookFactory($window, $timeout, $q) {
    var _this = this;

    _classCallCheck(this, FacebookFactory);

    this.options = {
      appId: null,
      status: true,
      cookie: false,
      xfbml: false,
      version: 'v2.4',
      scope: ''
    };
    var options = ['appId', 'status', 'cookie', 'xfbml', 'version', 'scope'];
    options.map(function (name) {
      _this[name] = angular.bind(_this, _this.getSetOption, name);
    });
    this.FB = null;
    this.FBPromise = null;
    this.initPromise = null;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$q = $q;
    this.loading = false;
    this.loaded = false;
    this.initialized = false;
  }

  _createClass(FacebookFactory, [{
    key: 'getSetOption',
    value: function getSetOption(name, val) {
      if (val === void 0) {
        return this.options[name];
      }
      this.options[name] = val;
      return this;
    }
  }, {
    key: 'handleResponse',
    value: function handleResponse(response) {
      if (!response || response.error) {
        this.reject(response && response.error || false);
      } else {
        this.resolve(response);
      }
    }
  }, {
    key: 'addCallbackToPromise',
    value: function addCallbackToPromise(deferred, callback) {
      var promise = deferred.promise;
      if (typeof callback === 'function') {
        promise.then(callback);
      }
      return promise;
    }
  }, {
    key: 'load',
    value: function load() {
      var _this2 = this;

      if (!this.FBPromise) {
        (function () {
          var deferred = _this2.$q.defer();
          _this2.$window.fbAsyncInit = function () {
            _this2.FB = _this2.$window.FB;
            _this2.loading = false;
            _this2.loaded = true;
            _this2.$timeout(function () {
              return deferred.resolve(FB);
            });
          };
          (function (d, s, id) {
            var js = void 0,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
              return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/pt_BR/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
          })(_this2.$window.document, 'script', 'facebook-jssdk');

          _this2.loading = true;

          _this2.FBPromise = deferred.promise;
        })();
      }
      return this.FBPromise;
    }
  }, {
    key: 'init',
    value: function init(params) {
      var _this3 = this;

      if (!this.initPromise) {
        this.initPromise = this.load().then(function (FB) {
          params = angular.extend({
            appId: _this3.options.appId,
            status: _this3.options.status,
            cookie: _this3.options.cookie,
            xfbml: _this3.options.xfbml,
            version: _this3.options.version
          }, params);

          if (!params.appId) {
            throw new Error('FacebookService: appId is not set');
          }

          FB.init(params);

          _this3.initialized = true;

          return FB;
        });
      }
      return this.initPromise;
    }
  }, {
    key: 'getLoginStatus',
    value: function getLoginStatus(callback) {
      var _this4 = this;

      return this.init().then(function (FB) {
        var deferred = _this4.$q.defer();

        FB.getLoginStatus(angular.bind(deferred, _this4.handleResponse));

        return _this4.addCallbackToPromise(deferred, callback);
      });
    }
  }, {
    key: 'api',
    value: function api() {
      var _this5 = this;

      var apiArgs = arguments;

      return this.init().then(function (FB) {
        var deferred = _this5.$q.defer(),
            args = Array.prototype.slice.call(apiArgs),
            callback = void 0;

        if (typeof args[args.length - 1] === 'function') {
          callback = args.pop();
        }
        args.push(angular.bind(deferred, _this5.handleResponse));

        FB.api.apply(FB, args);

        return _this5.addCallbackToPromise(deferred, callback);
      });
    }
  }, {
    key: 'login',
    value: function login(callback, opts) {
      var _this6 = this;

      return this.init().then(function (FB) {
        var deferred = _this6.$q.defer();

        if (typeof callback !== 'function') {
          callback = null;
          opts = callback;
        }

        var getOpt = function getOpt(name) {
          var val = opts && opts[name];
          return val === void 0 ? _this6.options[name] : val;
        };

        FB.login(angular.bind(deferred, _this6.handleResponse), {
          scope: getOpt('scope')
        });

        return _this6.addCallbackToPromise(deferred, callback);
      });
    }
  }, {
    key: 'logout',
    value: function logout(callback) {
      var _this7 = this;

      return this.getLoginStatus().then(function (response) {
        var deferred = _this7.$q.defer();

        if (response.authResponse) {
          _this7.FB.logout(angular.bind(deferred, callback));
        } else {
          deferred.reject(response);
        }

        return _this7.addCallbackToPromise(deferred, callback);
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect(callback) {
      var _this8 = this;

      return this.init().then(function (FB) {
        var deferred = _this8.$q.defer();

        FB.api('/me/permissions', 'DELETE', angular.bind(deferred, _this8.handleResponse));

        return _this8.addCallbackToPromise(deferred, callback);
      });
    }
  }], [{
    key: 'facebookFactory',
    value: function facebookFactory($window, $timeout, $q) {
      return new FacebookFactory($window, $timeout, $q);
    }
  }]);

  return FacebookFactory;
}();

exports.default = FacebookFactory;


FacebookFactory.facebookFactory.$inject = ['$window', '$timeout', '$q'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _facebook = require('./factory/facebook.js');

var _facebook2 = _interopRequireDefault(_facebook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = angular.module('facebookFactory', []).factory('FacebookFactory', _facebook2.default.facebookFactory);

},{"./factory/facebook.js":1}]},{},[2]);
