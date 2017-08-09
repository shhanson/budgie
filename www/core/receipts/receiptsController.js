angular.module('budgie.controllers', ['budgie.services', 'budgie.itemService']).controller('ReceiptsCtrl', function($scope, $http, $ionicModal, $cordovaCamera, ReceiptsService, ItemsService) {
  $scope.receipts;
  $scope.imgURI = 'img/test.JPG';
  const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";

  $scope.getReceipts = function() {
    $http.get('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/receipts/users/1').then((res) => {
      $scope.receipts = res.data;
    });
  };
  $scope.getReceipts();

  $scope.items = [];

  $scope.takePicture = function() {
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
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      console.log('error in grabbing image');
    });
  };

  $scope.getText = function() {
    let pickedImage = document.getElementById("pickedImage");
    console.log('getting to get text function');
    console.log(pickedImage, 'image at text function');
    Tesseract.recognize(pickedImage).then((result) => {
      console.log(result.text, 'result');
    })
  };

  $ionicModal.fromTemplateUrl('core/receipts/items.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.ItemsModal = modal;
  });

  $scope.showItems = function showItems(receipt) {
    ItemsService.getItems(receipt.id).then((res) => {
      $scope.items = res;
      console.log($scope.items);
    })
    $scope.receipt = receipt;
    $scope.ItemsModal.show();
  };

  $scope.closeModal = function closeModal() {
    $scope.ItemsModal.hide();
  };

  // RECEIPT MODAL STUFF
  $ionicModal.fromTemplateUrl('core/receipts/add-receipt.html', {
    id: 2,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.receiptModal = modal;
  });

  $scope.showAddReceipt = function showAddReceipt() {
    $scope.receiptModal.show();
  };

  $scope.closeReceiptModal = function closeModal() {
    $scope.receiptModal.hide();
  };

  $scope.newReceipt = {};

  $scope.inputItems = [
    {
      input: 'Item',
      price: '$0.00'
    }
  ];

  $scope.newReceiptItem = {
    name: '',
    price: '',
    tag_id: ''
  };
  $scope.listItems = [
    {
      name: '',
      price: '',
      tag_id: ''
    }
  ];

  $scope.addInput = function() {
    $scope.listItems.push($scope.newReceiptItem);
    $scope.newReceiptItem = {
      name: '',
      price: '',
      tag_id: ''
    };
    $scope.inputItems.push({input: 'Item', price: '$0.00'});
    console.log($scope.listItems);
  };

  $scope.deleteInput = function(index) {
    $scope.inputItems.splice(index, 1);
    $scope.listItems.splice(index, 1);
    console.log($scope.listItems);
  }

  $scope.addNewReceipt = function() {
    if ($scope.listItems[$scope.listItems.length - 1].name === '') {
      $scope.listItems.splice($scope.listItems.length - 1, 1);
    }
    $scope.newReceipt.listItems = $scope.listItems;
    $http.post(`${API_URL}/receipts/users/1`, $scope.newReceipt).then(() => {
      $scope.getReceipts(1);
      $scope.closeReceiptModal();
    });
  }

  $scope.deleteReceipt = function(receipt) {
    $http.delete(`${API_URL}/receipts/${receipt.id}`).then(() => {
      $scope.getReceipts(1);
    });
  }

  $scope.imgURI;

  $scope.getTags = function getTags(userID) {
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

  //ITEMS STUFF
  // $scope.getItems = function getItems(receiptID) {
  //   ItemsService.getItems(receiptID).then((response) => {
  //     $scope.items = response.data;
  //   });
  // };
  //
  // $scope.getItems($scope.receipt.id);

  $scope.getSelectedTag = function getSelectedTag(tagSelected, item) {
    // let itemToEdit = $scope.receipt.items.find(item => item.id === itemID);
    //
    // const itemUpdatedTag = {
    //   id: itemToEdit.id,
    //   name: itemToEdit.name,
    //   price: itemToEdit.price,
    //   receipt_id: itemToEdit.receipt_id
    // };
    delete item.tag;
    for (let j = 0; j < $scope.allTags.length; j++) {
      if ($scope.allTags[j].tag === tagSelected) {
        item.tag_id = $scope.allTags[j].id;
        break;
      }
    }

    $http.patch(`${API_URL}/receipts/${item.rececipt_id}/items/${item.id}`, item).catch((err) => {
      console.error(err);
    });
  };

  $scope.updateReceipt = function(receipt) {
    const updated = {
      location: receipt.location,
      date: receipt.date
    }
    ReceiptsService.editReceipt(receipt.id, updated);
  }

  $scope.editItems = function editItems(item) {
    delete item.tag;
    console.log(item);
    $http.patch(`${API_URL}/receipts/${item.receipt_id}/items/${item.id}`, item).then(() => {
      ItemsService.getItems(item.receipt_id).then((res) => {
        $scope.items = res;
      });
    });
  };

  $scope.newItem = {};

  $scope.addItem = function addItem(receipt) {
    $scope.newItem.receipt_id = receipt.id;
    $http.post(`${API_URL}/receipts/${receipt.id}/items`, $scope.newItem).then(() => {
      ItemsService.getItems(receipt.id).then((res) => {
        $scope.items = res;
        $scope.newItem = {};
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  $scope.deleteItem = function deleteItem(itemID, receiptID) {
    $http.delete(`${API_URL}/receipts/${receiptID}/items/${itemID}`).then(() => {
      ItemsService.getItems(receiptID).then((res) => {
        $scope.items = res;
      })
    }).catch((err) => {
      console.error(err);
    });
  };
});
