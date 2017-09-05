angular.module('budgie').controller('ReceiptsCtrl', function  ReceiptsCtrl ($scope, $http, $ionicModal, $cordovaCamera, ReceiptsService, ItemsService, UserService, $ionicPopup, AUTH_EVENTS, $state, $ionicLoading, CameraService) {
  $scope.user = UserService.currentUser;
  $scope.receipts;
  $scope.items = [];
  $scope.newItem = {};
  $scope.newTag = {};
  $scope.currMonth;
  $scope.newReceiptItem = {
    name: '',
    price: '',
    tag_id: null,
  };

  $scope.resetReceipt = function resetReceipt () {
    $scope.inputItems = [{input: 'Item', price: '$0.00'}];
    $scope.listItems = [{name: '', price: '', tag_id: null}];
    $scope.newReceipt = {};
    $scope.imgURI = '';
    $scope.loading = false;
  };

  $scope.resetReceipt();

  $scope.getReceipts = function getReceipts () {
    ReceiptsService.getReceipts($scope.user.id).then((res) => {
      $scope.receipts = ReceiptsService.receipts;
    });
  };

  $scope.getReceipts();

  $scope.setMonth = function (month) {
    if ($scope.currMonth === month) {
      $scope.currMonth = undefined;
    } else {
      $scope.currMonth = month;
    }
  };

  // ITEM MODAL STUFF
  $scope.getItems = function getItems(receiptID){
    ItemsService.getItems(receiptID).then((res) => {
      $scope.items = res;
    });
  }

  $ionicModal.fromTemplateUrl('core/receipts/items.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then((modal) => {
    $scope.ItemsModal = modal;
  });

  $scope.showItems = function showItems(receipt) {
    $scope.getItems(receipt.id);
    $scope.receipt = receipt;
    $scope.ItemsModal.show();
  };

  $scope.closeModal = function closeModal() {
    $scope.ItemsModal.hide();
  };

  // RECEIPT MODAL STUFF
  $ionicModal.fromTemplateUrl('core/receipts/add-receipt.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then((modal) => {
    $scope.receiptModal = modal;
  });

  $scope.showAddReceipt = function showAddReceipt() {
    $scope.receiptModal.show();
  };

  $scope.closeReceiptModal = function closeReceiptModal() {
    $scope.receiptModal.hide();
    $scope.resetReceipt();
  };

  // ADD NEW RECEIPT
  $scope.addInput = function () {
    if ($scope.newReceiptItem.tag_id == null) {
      delete $scope.newReceiptItem.tag_id;
    }
    $scope.listItems.push($scope.newReceiptItem);
    $scope.newReceiptItem = { name: '', price: '', tag_id: null };
    $scope.inputItems.push({ input: 'Item', price: '$0.00' });
  };

  $scope.deleteInput = function (index) {
    $scope.inputItems.splice(index, 1);
    $scope.listItems.splice(index, 1);
  };

  $scope.addNewReceipt = function () {
    if ($scope.listItems[$scope.listItems.length - 1].name === '') {
      $scope.listItems.splice($scope.listItems.length - 1, 1);
    }
    $scope.newReceipt.listItems = $scope.listItems;
    ReceiptsService.addReceipt($scope.newReceipt, $scope.user.id)
    .then(() => {
      $scope.getReceipts();
      $scope.resetReceipt();
      $scope.closeReceiptModal();
    });
  };

  // TAGS
  $scope.getTags = function getTags() {
    ItemsService.getTags($scope.user.id).then(() => {
      $scope.allTags = ItemsService.tags;
    });
  };

  if ($scope.user) {
    $scope.getTags();
  }

  $scope.tagHandler = function tagHandler(item) {
    if (item.tag_id === 'addNewTag') {
      $scope.addTagAlert(item);
    }
  };

  $scope.addTagAlert = function addTagAlert(item) {
    const tagPopup = $ionicPopup.show({
      title: 'Add a new tag',
      template: "<input type='text' ng-model='newTag.tag'>",
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          onTap(e) {
            $scope.newTag.tag = '';
            $scope.getItems(item.receipt_id);
          },
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap(e) {
            if (!$scope.newTag.tag) {
              e.preventDefault();
              return;
            }
            ItemsService.addTag($scope.user.id, $scope.newTag)
            .then((response) => {
              if (item.id) {
                item.tag_id = response.id;
                ItemsService.editItem(item)
                .then(()=>(ItemsService.getItems(item.receipt_id)))
                .then((res)=>{
                  $scope.items = res;
                });
                $scope.getTags();
                $scope.newTag.tag = '';
              }
            });
          },
        },
      ],
    });
  };

  $scope.getSelectedTag = function getSelectedTag(tagSelected, item) {
    if (tagSelected === 'addNewTag') {
      $scope.addTagAlert(item);
      return;
    }

    $scope.allTags.forEach((t) => {
      if (t.tag === tagSelected) {
        item.tag_id = t.id;
      }
    });

    if (item.id) {
      delete item.tag;
      ItemsService.editItem(item).then(() => {});
    }
  };

  // EDIT RECEIPT
  $scope.updateReceipt = function updateReceipt(receipt) {
    ReceiptsService.editReceipt({id: receipt.id, location: receipt.location})
    .then(()=>{
      $scope.getReceipts();
    });
  };

  $scope.deleteReceipt = function deleteReceipt(receipt) {
    ReceiptsService.deleteReceipt(receipt).then(() => {$scope.getReceipts()});
  };

  $scope.editItems = function editItems(item) {
    delete item.tag;
    ItemsService.editItem(item).then(() => {});
  };

  $scope.addItem = function addItem(receipt) {
    $scope.newItem.receipt_id = receipt.id;
    ItemsService.addItem(receipt.id, $scope.newItem)
    .then(() => {
      $scope.getItems()
      $scope.newItem = {};
    });
  };

  $scope.deleteItem = function deleteItem(item) {
    ItemsService.deleteItem(item).then(() => {
      $scope.getItems();
    });
  };

  $scope.showPictureAlert = function () {
    CameraService.pictureAlert()
    .then(fromCamera => CameraService.takePicture(fromCamera)
    .then((imageData) => {
      $scope.loading = true;
      $scope.imgURI = `data:image/jpeg;base64,${imageData}`;
      return imageData;
    }))
    .then(imageData => CameraService.postImage(imageData))
    .then((res) => {
      res.forEach((item) => {
        $scope.loading = false;
        $scope.listItems.unshift(item);
        $scope.inputItems.unshift(item);
      });
    });
  };
});
