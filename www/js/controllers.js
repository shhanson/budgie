angular.module('starter.controllers', []).controller('ReceiptsCtrl', function($scope, $http, $ionicModal, $cordovaCamera) {
  $scope.receipts;
  $scope.imgURI= 'img/text.JPG';


  $scope.getReceipts = function() {
    $http.get('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/receipts/users/1').then((res) => {
      $scope.receipts = res.data;
    });
  };
  $scope.getReceipts();


  $scope.takePicture = function() {
    var options = {
        quality : 75,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      console.log('error in grabbing image');
    });
  }

  $scope.getText = function() {
    let pickedImage = document.getElementById("pickedImage");
    console.log('getting to get text function');
    console.log(pickedImage, 'image at text function');
    Tesseract.recognize(pickedImage)
    .then((result) => {
      console.log(result.text, 'result');
    })
  }

    // console.log('making it here');
    // var options = {
    //     quality : 75,
    //     destinationType : Camera.DestinationType.DATA_URL,
    //     sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
    //     allowEdit : true,
    //     encodingType: Camera.EncodingType.JPEG,
    //     targetWidth: 300,
    //     targetHeight: 300,
    //     popoverOptions: CameraPopoverOptions,
    //     saveToPhotoAlbum: false
    // };
    //
    // $cordovaCamera.getPicture(options).then(function(imageData) {
    //   console.log('got picture?');
    //   $scope.imgURI = "data:image/jpeg;base64," + imageData;
    //
    //   let imageFromDom = document.getElementById('example');
    //   Tesseract.recognize(myImg)
    //   .then((result) => {
    //     console.log(result, 'result');
    //   })
    // }, function(err) {
    //   // console.log('error');
    //     // An error occured. Show a message to the user
    // });




  $ionicModal.fromTemplateUrl('templates/items.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showItems = function(receipt) {
    $scope.receipt = receipt;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  }

}).controller('ItemsCtrl', function($scope, $stateParams, $http) {
  $scope.items;

  $scope.getItems = function() {
    $http.get(`http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/receipts/${$stateParams.receiptId}/items`).then((res) => {
      $scope.items = res.data;
    });
  };
  $scope.getItems();
}).controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}).controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}).controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
}).controller('GraphCtrl', function($scope, $http) {
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
    $http.get('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/receipts/users/1').then(function(res) {
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
