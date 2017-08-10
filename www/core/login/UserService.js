angular.module('budgie.userServices', []).service('UserService', [
  '$http',
  function service($http) {
    const se = this;
    se.currentUser = {};
    se.signUp = function(userData) {
      return $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/users/signup', userData).then(function(result) {
        se.currentUser = result.data[0];
      });
    };

    se.login = function(userData) {
      return $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/users', userData).then(function(result) {
        se.currentUser = result.data;
      });
    };
  }
]);
