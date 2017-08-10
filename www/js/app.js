angular.module('budgie', [
  'ionic',
  'budgie.controllers',
  'budgie.graphs',
  'budgie.userServices',
  'budgie.itemService',
  'budgie.services',
  'budgie.login',
  'nvd3',
  'ngCordova'
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
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});
