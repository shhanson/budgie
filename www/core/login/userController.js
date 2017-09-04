angular.module('budgie').controller('LoginCtrl', function($scope, $stateParams, $http, $state, UserService, $ionicModal, $ionicPopup, AUTH_EVENTS) {
  $scope.newUserData = {};
  $scope.loginData = {};
  $scope.signInError;
  $scope.signUpError;

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
    if (UserService.currentUser) {
      $state.go('tab.receipts', {}, {reload: true});
    }
  };

  $scope.checkUser();

  $scope.signUp = function() {
    UserService.signUp($scope.newUserData).then((err) => {
      if (err) {
        $scope.signUpError = err;
      } else {
        $scope.closeSignUp();
        $state.go('tab.receipts', {}, {reload: true});
      }
    });
  };

  $scope.login = function() {
    UserService.login($scope.loginData).then((err) => {
      if (err) {
        $scope.signInError = err;
      } else {
        $scope.closeSignIn();
        $state.go('tab.receipts', {}, {reload: true});
      }
    });
  }

  $scope.logout = function() {
    UserService.logout();
    $state.go('splash', {}, {reload: true});
  }

  //SIGN IN MODAL
  $ionicModal.fromTemplateUrl('core/login/sign-in.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.signInModal = modal;
  });

  $scope.showSignIn = function() {
    $scope.signInModal.show();
  };

  $scope.closeSignIn = function closeModal() {
    $scope.loginData = {};
    $scope.signInError = false;
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
    $scope.signUpModal.show();
  };

  $scope.closeSignUp = function closeModal() {
    $scope.newUserData = {};
    $scope.signUpError = false;
    // form.setUntouched();
    $scope.signUpModal.hide();
  };

  //MANAGE TAGS MODAL
  $ionicModal.fromTemplateUrl('core/login/manage-tags.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.tagModal = modal;
  });

  $scope.showManageTagsModal = function() {
    $scope.tagModal.show();
  };

  $scope.closeManageTagsModal = function closeModal() {
    $scope.tagModal.hide();
  };

  //TAG STUFF
  $scope.getUserTags = function getUserTags() {
    UserService.getUserTags().then(() => {
      $scope.allUserTags = UserService.allUserTags;
    });
  };
  $scope.getUserTags();

  $scope.deleteTag = function deleteTag(tagID) {
    UserService.deleteTag(tagID).then(() => {

      $scope.getUserTags();
    });
  };

  $scope.newTag = {};
  $scope.addTagAlert = function addTagAlert(i) {
    const tagPopup = $ionicPopup.show({
      title: "Add a new tag",
      template: "<input type='text' ng-model='newTag.tag'>",
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          onTap: function(e) {}
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newTag.tag) {
              e.preventDefault();
            } else {
              $http.post(`http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/tags/users/${UserService.currentUser.id}`, $scope.newTag).then((response) => {
                $scope.getUserTags();
                $scope.newTag = {};
              })
            }
          }
        }
      ]
    });

    tagPopup.catch(err => console.log(err));
  };
});
