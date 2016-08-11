# angular-facebook-factory
Facebook factory for AngularJS

## Example
```javascript
angular
  .module('app', ['ngFacebook'])
  .controller('AppController', function($scope, FacebookFactory) {
    FacebookFactory.init({
      appId: 'appId'
    })
  })
```
[View full example](./example/index.html)