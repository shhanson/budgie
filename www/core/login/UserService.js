angular.module('budgie').service('UserService', [
  '$http',
  function service($http) {
    const se = this;
    const LOCAL_TOKEN_KEY = 'saaaas50';
    const username = '';
    const isAuthenticated = false;
    let authToken;

    se.currentUser = {};
    se.allUserTags = [];

    function loadUserCredentials() {
      const token = window.localStorage.getItem(LOCAL_TOKEN_KEY);

      if (token) {
        useCredentials(token);
      }
    }

    loadUserCredentials();

    function useCredentials(token) {
      const local = token.split('|')[0]
      se.currentUser = JSON.parse(local);
      delete se.currentUser.password;
      se.isAuthenticated = true;
      se.authToken = token;
      // Set the token as header for your requests!
      $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    se.signUp = function(userData) {
      return $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/users/signup', userData).then(function(result) {
        storeUserCredentials(JSON.stringify(result.data) + '|1b2u3d4g5i6e');
      });
    };

    se.login = function(userData) {
      return $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/users', userData).then(function(result) {
        storeUserCredentials(JSON.stringify(result.data) + '|1b2u3d4g5i6e');
      });
    };

    se.logout = function() {
      destroyUserCredentials();
    };

    function destroyUserCredentials() {
      se.authToken = undefined;
      se.isAuthenticated = false;
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      se.currentUser = undefined;
    }

    se.getUserTags = function () {
      return $http.get(`http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/tags/users/${se.currentUser.id}`).then((response) => {
        se.allUserTags = response.data;
      });
    };

    se.deleteTag = function deleteTag(tagID) {
      //get all user items with tag, set their tags to ""
      return $http.delete(`http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/tags/${tagID}`).then((response)=>{
        se.allUserTags = se.allUserTags.filter(tag => tag.id !== tagID);
      });
      //delete tag
    };
  }
]).constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
}).factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function(response) {
      $rootScope.$broadcast(
      {401: AUTH_EVENTS.notAuthenticated, 403: AUTH_EVENTS.notAuthorized}[response.status], response);
      return $q.reject(response);
    }
  };
}).config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
