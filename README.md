# angular-facebook-factory
Facebook factory for AngularJS 1.x

## Example

[View auth example](./examples/index.html)

### Config
```javascript
angular
  .module('app', ['ngFacebook'])
  .controller('AppController', ['$scope','FacebookFactory',function($scope,FacebookFactory) {
    FacebookFactory.setLang('pt_BR') // set lang
    FacebookFactory.init({
      appId: 'appId', // required, default = null
      status: true, // optional, default = true
      cookie: false, // optional, default = false
      xfbml: false, // optional, default = false
      version: 'v2.4' // optional, default = v2.4
    })
  }])
```

### Creating service
```javascript
angular
  .module('app')
  .service('FacebookService', ['$http','FacebookFactory',function($http,FacebookFactory) {
    var service = {
      me: me,
      auth: auth,
      logout: logout,
      disconnect: disconnect
    }
    return service
    function me(callback) {
      FacebookFactory.api('/me', {
        fields: 'name,email,gender,birthday'
      }, function(response) {
        callback(response)
      })
    }
    function auth(callback) {
      FacebookFactory.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          callback(response)
        } else {
          FacebookFactory.login(function(response) {
            if (response.status === 'connected') {
              callback(response)
            }
          }, {
            scope: 'public_profile,email,user_birthday'
          })
        }
      })
    }
    function logout(callback) {
      FacebookFactory.logout(function(response) {
        callback(response)
      })
    }
    function disconnect(callback) {
      FacebookFactory.disconnect(function(response) {
        callback(response)
      })
    }
  }])
```

### Creating controller
```javascript
angular
  .module('app')
  .controller('AuthController', ['$scope','FacebookFactory','FacebookService',function($scope,FacebookFactory,FacebookService) {
    $scope.getAuth = function(callback) {
      FacebookService.auth(function(response) {
        $scope.token = response.authResponse.accessToken // Get token
        FacebookService.me(function(response) {
          // Response handling
        })
      })
    }
    $scope.logout = function() {
      FacebookService.logout(function(response) {
        // Response handling
      })
    }
    $scope.disconnect = function() {
      FacebookService.disconnect(function(response) {
        // Response handling
      })
    }
  }])
```

---

## Changelog

Version | Description
--- | ---
1.0.2 | Method setLang on factory and better documentation

## Developer

### npm scripts

Command | Description
--- | ---
npm run build | Concat, Babelify and Minify 