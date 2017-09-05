angular.module('budgie').controller('ReceiptsCtrl', function($scope, $http, $ionicModal, $cordovaCamera, ReceiptsService, ItemsService, UserService, $ionicPopup, AUTH_EVENTS, $state, $ionicLoading, CameraService) {
  $scope.user = UserService.currentUser;
  $scope.imgURI = CameraService.imgURI;
  $scope.loading = CameraService.loading;
  $scope.receipts;
  $scope.newItem = {};
  $scope.items = [];
  $scope.newReceipt = {};
  $scope.newTag = {};
  $scope.currMonth;
  $scope.inputItems = [
    {
      input: 'Item',
      price: '$0.00'
    }
  ];
  $scope.newReceiptItem = {
    name: '',
    price: '',
    tag_id: null
  };
  $scope.listItems = [
    {
      name: '',
      price: '',
      tag_id: null
    }
  ];

  $scope.getReceipts = function() {
    ReceiptsService.getReceipts($scope.user.id).then((res) => {
      $scope.receipts = ReceiptsService.receipts;
    });
  };

  $scope.getReceipts();

  $scope.setMonth = function(month) {
    if ($scope.currMonth === month) {
      $scope.currMonth = undefined;
    } else {
      $scope.currMonth = month;
    }
  };

  $scope.showPictureAlert = function() {
    CameraService.pictureAlert()
    .then(fromCamera =>CameraService.takePicture(fromCamera)
    .then((imageData)=>{
      $scope.loading = true;
      $scope.imgURI = 'data:image/jpeg;base64,' + imageData;
      return imageData;
    }))
    .then(imageData => CameraService.postImage(imageData))
    .then((res)=>{
      res.forEach((item) => {
        $scope.loading = false;
        $scope.listItems.unshift(item);
        $scope.inputItems.unshift(item);
      });
    }).catch((err)=>{
      console.log(err);
    })
  }

  //ITEM MODAL STUFF
  $ionicModal.fromTemplateUrl('core/receipts/items.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.ItemsModal = modal;
  });

  $scope.showItems = function showItems(receipt) {
    ItemsService.getItems(receipt.id).then((res) => {
      $scope.items = res;
    })
    $scope.receipt = receipt;
    $scope.ItemsModal.show();
  };

  $scope.closeModal = function closeModal() {
    $scope.ItemsModal.hide();
  };

  // RECEIPT MODAL STUFF
  $ionicModal.fromTemplateUrl('core/receipts/add-receipt.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.receiptModal = modal;
  });

  $scope.showAddReceipt = function showAddReceipt() {
    $scope.receiptModal.show();
  };

  $scope.closeReceiptModal = function closeReceiptModal() {
    $scope.receiptModal.hide();
    $scope.newReceipt = {};
    $scope.loading = false;
    $scope.inputItems = [
      {
        input: 'Item',
        price: '$0.00'
      }
    ];
    $scope.listItems = [
      {
        name: '',
        price: '',
        tag_id: null
      }
    ];
    $scope.newReceipt.location = '';
    $scope.newReceipt.date = '';
    $scope.imgURI = '';
  };

  $scope.addInput = function() {
    if ($scope.newReceiptItem.tag_id == null) {
      delete $scope.newReceiptItem.tag_id;
    }
    $scope.listItems.push($scope.newReceiptItem);
    $scope.newReceiptItem = {
      name: '',
      price: '',
      tag_id: null
    };
    $scope.inputItems.push({input: 'Item', price: '$0.00'});
  };

  $scope.deleteInput = function(index) {
    $scope.inputItems.splice(index, 1);
    $scope.listItems.splice(index, 1);
  }

  $scope.addNewReceipt = function() {
    if ($scope.listItems[$scope.listItems.length - 1].name === '') {
      $scope.listItems.splice($scope.listItems.length - 1, 1);
    };
    $scope.newReceipt.listItems = $scope.listItems;
    ReceiptsService.addReceipt($scope.newReceipt, $scope.user.id).then(() => {
      $scope.getReceipts();
      $scope.inputItems = [
        {
          input: 'Item',
          price: '$0.00'
        }
      ];
      $scope.listItems = [
        {
          name: '',
          price: '',
          tag_id: null
        }
      ];
      $scope.newReceipt.location = "";
      $scope.newReceipt.date = "";
      $scope.closeReceiptModal();
    });
  }

  $scope.deleteReceipt = function(receipt) {
    ReceiptsService.deleteReceipt(receipt).then(() => {
      $scope.receipts = ReceiptsService.receipts;
    })
  }

  $scope.getTags = function getTags() {
    ItemsService.getTags($scope.user.id).then(() => {
      $scope.allTags = ItemsService.tags;
    });
  };

  if ($scope.user) {
    $scope.getTags();
  }

  $scope.tagHandler = function tagHandler(item) {
    if (item.tag_id === "addNewTag") {
      $scope.addTagAlert(item);
    }
  };

  $scope.addTagAlert = function addTagAlert(item) {
    let tagPopup = $ionicPopup.show({
      title: "Add a new tag",
      template: "<input type='text' ng-model='newTag.tag'>",
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          onTap: function(e) {
            if ($scope.newTag.tag) {
              $scope.newTag.tag = "";
            }

            ItemsService.getItems(item.receipt_id).then((res) => {
              $scope.items = res;
            });

          }
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newTag.tag) {
              e.preventDefault();
              return;
            }
            ItemsService.addTag($scope.user.id, $scope.newTag).then((response) => {
              const patchTag = {
                tag_id: response.id
              };
              if (item.id) {
                ItemsService.editItem(item.receipt_id, item.id, patchTag).then(() => ItemsService.getItems(item.receipt_id)).then((res) => {
                  $scope.items = res;
                  $scope.newTag.tag = "";
                }).catch((err) => {
                  console.error(err);
                });
              }

              $scope.getTags();

            }).catch((err) => {
              console.error(err);
            });
          }
        }
      ]
    });

    tagPopup.catch((err) => {
      console.error(err);
    });
  };

  $scope.getSelectedTag = function getSelectedTag(tagSelected, item) {
    if (tagSelected === 'addNewTag') {
      $scope.addTagAlert(item);
    } else {
      for (let j = 0; j < $scope.allTags.length; j++) {
        if ($scope.allTags[j].tag === tagSelected) {
          item.tag_id = $scope.allTags[j].id;
          break;
        }
      }
    }

    if (item.id) {
      delete item.tag;
      ItemsService.editItem(item).then(() => {});
    }
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
    ItemsService.editItem(item).then(() => {});
  };

  $scope.addItem = function addItem(receipt) {
    $scope.newItem.receipt_id = receipt.id;
    ItemsService.addItem(receipt.id, $scope.newItem).then(() => {
      ItemsService.getItems(receipt.id).then((res) => {
        $scope.items = res;
        $scope.newItem = {};
      });
    });
  };

  $scope.deleteItem = function deleteItem(item) {
    ItemsService.deleteItem(item).then((res) => {
      $scope.items = ItemsService.items;
    })
  };
});
