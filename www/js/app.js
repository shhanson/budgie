angular.module('budgie', [
  'ionic',
  'budgie.controllers',
  'budgie.graphs',
  'budgie.itemService',
  'budgie.services',
  'nvd3',
  'ngCordova',
  'angular.filter'
]).run(($ionicPlatform) => {

  $ionicPlatform.ready(() => {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('splash', {
    url: '',
    templateUrl: 'templates/splash.html'
  })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
    .state('tab.receipts', {
    url: '/receipts',
    views: {
      'tab-receipts': {
        templateUrl: 'core/receipts/tab-receipts.html',
        controller: 'ReceiptsCtrl'
      }
    }
  }).state('tab.charts', {
    url: '/charts',
    views: {
      'tab-charts': {
        templateUrl: 'core/graphs/tab-charts.html',
        controller: 'GraphCtrl'
      }
    }
  }).state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'core/login/tab-account.html',
        controller: 'LoginCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
}).run(function($rootScope, $state, UserService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {

    // if ('data' in next && 'authorizedRoles' in next.data) {
    //   var authorizedRoles = next.data.authorizedRoles;
    //   if (!UserService.isAuthorized(authorizedRoles)) {
    //     event.preventDefault();
    //     $state.go($state.current, {}, {reload: true});
    //     $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
    //   }
    // }

    if (!UserService.isAuthenticated) {
      if (next.name !== 'splash') {
        event.preventDefault();
        $state.go('splash');
      }
    }
  });
})
