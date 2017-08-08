
angular.module('starter.controllers', ['starter.services']).controller('ReceiptsCtrl', function($scope, $http, $ionicModal, $cordovaCamera, ReceiptsService, ItemsService) {
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

  $ionicModal.fromTemplateUrl('templates/items.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showItems = function showItems(receipt) {
    $scope.receipt = receipt;
    $scope.modal.show();
  };
  $scope.closeModal = function closeModal() {
    $scope.modal.hide();
  };

  $scope.imgURI;


  $scope.getTags = function getTags(userID){
    $http.get(`${API_URL}/tags/users/${userID}`).then((response) => {
      //const toReturn = response.data.filter(tag => tag.tag !== tagName);
      $scope.allTags = response.data;

      //return toReturn;
    }).catch((err) => {
      console.error(err);
    });
  };
  $scope.getTags(1);


  // RECEIPTS STUFF
  $scope.getReceipts = function getReceipts(userID) {
    ReceiptsService.getReceipts(userID).then(() => {
      $scope.receipts = ReceiptsService.receipts;
    });
  };

  $scope.getReceipts(1);

  // ITEMS STUFF
  // $scope.getItems = function getItems(receiptID) {
  //   ItemsService.getItems(receiptID).then((response) => {
  //     $scope.items = response.data;
  //   });
  // };

  //$scope.getItems($scope.receipt.id);

  $scope.getSelectedTag = function getSelectedTag(tagSelected, receiptID, itemID){
    let itemToEdit = $scope.receipt.items.find(item => item.id === itemID);

    const itemUpdatedTag = {
      id: itemToEdit.id,
      name: itemToEdit.name,
      price: itemToEdit.price,
      receipt_id: itemToEdit.receipt_id,
    };

    for(let j = 0; j < $scope.allTags.length; j++){
      if($scope.allTags[j].tag === tagSelected){
        itemUpdatedTag.tag_id = $scope.allTags[j].id;
        break;
      }
    }

    $http.patch(`${API_URL}/receipts/${receiptID}/items/${itemID}`, itemUpdatedTag).catch((err) => {
      console.error(err);
    });
  };


  $scope.editItems = function editItems(){

    const receiptID = $scope.receipt.id;
    const updatedItems = $scope.receipt.items;
    for(let i = 0; i < updatedItems.length; i++){
      let editedItem = {
        id: updatedItems[i].id,
        name: updatedItems[i].name,
        price: updatedItems[i].price,
        receipt_id: updatedItems[i].receipt_id,
      };

      for(let j = 0; j < $scope.allTags.length; j++){
        if($scope.allTags[j].tag === updatedItems[i].tag){
          editedItem.tag_id = $scope.allTags[j].id;
          break;
        }
      }

      $http.patch(`${API_URL}/receipts/${receiptID}/items/${updatedItems[i].id}`, editedItem).catch((err) => {
        console.error(err);
      });
    }

  };




  $scope.takePicture = function() {
    console.log('making it here');
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log('got picture?');
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
      console.log($scope.imgURI);
    }, function(err) {
      console.log('error');
      // An error occured. Show a message to the user
    });
  }
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
}).controller('GraphCtrl', function($scope, $http, $ionicModal) {
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
        return d3.time.format('%m/%d')(new Date(d.key));
      },
      y(d) {
        return d.total;
      },
      showValues: true,
      objectequality: false,
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
      $scope.receipts = res.data;
      $scope.updateGraphData();
    });
  };
  $scope.getReceiptData();
  // $scope.api.update();
  $scope.updateGraphData = function() {
    $scope.receipts.forEach(function(receipt) {
      const dataObj = {};
      dataObj.key = receipt.date;
      dataObj.items = receipt.items;
      dataObj.total = dataObj.items.map(function(item) {
        return parseInt(item.price, 10)
      }).reduce(function(a, b) {
        return a + b
      });
      $scope.data[0].values.push(dataObj);
    });
  };

  $ionicModal.fromTemplateUrl('templates/graphControl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showGraphControl = function(receipts) {
    $scope.receipts = receipts;
    $scope.modal.show();
  };

  $scope.saveGraphControls = function(controlForm) {
    const activeItems = [];
    $scope.receipts.items.filter((item) => {
      if (activeItems.indexOf(item.id) !== -1) {
        return item;
      }
    });
    $scope.updateGraphData();
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  }
});
