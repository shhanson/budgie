angular.module('budgie').controller('LoginCtrl', function($scope, $stateParams, $state, UserService, $ionicModal, $ionicPopup, AUTH_EVENTS) {
  $scope.newUserData = {};
  $scope.loginData = {};

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({title: 'Unauthorized!', template: 'You are not allowed to access this resource.'});
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    UserService.logout();
    $state.go('splash');
    var alertPopup = $ionicPopup.alert({title: 'Session Lost!', template: 'Sorry, You have to login again.'});
  });

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };

  $scope.checkUser = function() {
    if (UserService.currentUser.id) {
      $state.go('tab.receipts');
    }
  };

  $scope.checkUser();

  $scope.signUp = function() {
    UserService.signUp($scope.newUserData).then(() => {
      $scope.closeSignUp();
      $state.go('tab.receipts');
    });
  };

  $scope.login = function() {
    UserService.login($scope.loginData).then(() => {
      $scope.closeSignIn();
      $state.go('tab.receipts');
    });
  };

  //LANDING PAGE MODAL
  $ionicModal.fromTemplateUrl('core/login/user-landing.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.landingModal = modal;
  });

  $scope.showLanding = function() {
    $scope.landingModal.show();
  };

  $scope.closeLanding = function closeModal() {
    $scope.landingModal.hide();
  };

  //SIGN IN MODAL
  $ionicModal.fromTemplateUrl('core/login/sign-in.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.signInModal = modal;
  });

  $scope.showSignIn = function() {
    $scope.landingModal.hide();
    $scope.signInModal.show();
  };

  $scope.closeSignIn = function closeModal() {
    $scope.signInModal.hide();
  };
  //SIGN UP MODAL
  $ionicModal.fromTemplateUrl('core/login/sign-up.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.signUpModal = modal;
  });

  $scope.showSignUp = function() {
    $scope.landingModal.hide();
    $scope.signUpModal.show();
  };

  $scope.closeSignUp = function closeModal() {
    $scope.signUpModal.hide();
  };

}).controller('AccountCtrl', function($scope, $stateParams) {});
