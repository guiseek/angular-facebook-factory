import FacebookFactory from './factory/facebook.js'

export default angular
  .module('ngFacebook', [])
  .factory('FacebookFactory', FacebookFactory.facebookFactory)