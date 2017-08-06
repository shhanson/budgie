angular.module('starter.controllers', []).controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {scope: $scope}).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8000/users/signup', $scope.loginData).then(function(result) {
      $scope.user = result.data;
      $scope.closeLogin();
    });
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(() => {
      $scope.closeLogin();
    }, 1000);
  };
}).controller('ReceiptsCtrl', function($scope, $http) {
  $scope.receipts;

  $scope.getReceipts = function() {
    $http.get('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8000/receipts/users/1').then(function(res) {
      $scope.receipts = res.data;
    });
  };
  $scope.getReceipts();
}).controller('ItemsCtrl', function($scope, $stateParams, $http) {
  $scope.items;

  $scope.getItems = function() {
    $http.get(`http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8000/receipts/${$stateParams.receiptId}/items`).then(function(res) {
      $scope.items = res.data;
    });
  };
  $scope.getItems();
}).controller('BrowseCtrl', function($scope, $http) {
  $scope.options = {
    chart: {
      type: 'discreteBarChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x(d) {
        return d.key;
      },
      y(d) {
        return d.y;
      },
      showValues: true,
      valueFormat(d) {
        return d3.format(',.2f')(d);
      },
      duration: 500,
      xAxis: {
        axisLabel: 'Date'
      },
      yAxis: {
        axisLabel: 'Total Spent',
        axisLabelDistance: -10
      }
    }
  };
  $scope.data = [
    {
      key: 'Cumulative Return',
      values: []
    }
  ];
  $scope.getReceiptData = function() {
    $http.get('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8000/receipts/users/1').then(function(res) {
      res.data.forEach(function(receipt) {
        const dataObj = {};
        dataObj.key = receipt.date;
        dataObj.y = receipt.items.map(function(item) {
          return parseInt(item.price, 10)
        }).reduce(function(a, b) {
          return a + b
        });
        $scope.data[0].values.push(dataObj);
      });
      console.log($scope.data);
    });
  };
  $scope.getReceiptData();
});
