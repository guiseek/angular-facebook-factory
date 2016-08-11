import FacebookFactory from './factory/facebook.js'

export default angular
  .module('facebookFactory', [])
  .factory('FacebookFactory', FacebookFactory.facebookFactory)