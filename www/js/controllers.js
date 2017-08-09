angular.module('starter.controllers', ['starter.services']).controller('ReceiptsCtrl', function($scope, $ionicModal, ReceiptsService, ItemsService, $cordovaCamera, $http) {

  //ITEMS MODAL STUFF
  $ionicModal.fromTemplateUrl('templates/items.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.ItemsModal = modal;
  });

  $scope.showItems = function showItems(receipt) {
    $scope.receipt = receipt;
    $scope.ItemsModal.show();
  };

  $scope.closeModal = function closeModal() {
    $scope.ItemsModal.hide();
  };

  // RECEIPT MODAL STUFF
  $ionicModal.fromTemplateUrl('templates/add-receipt.html', {
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

  // ITEMS STUFF
  // $scope.getItems = function getItems(receiptID) {
  //   ItemsService.getItems(receiptID).then((response) => {
  //     $scope.items = response.data;
  //   });
  // };

  //$scope.getItems($scope.receipt.id);

  $scope.getSelectedTag = function getSelectedTag(tagSelected, receiptID, itemID) {
    let itemToEdit = $scope.receipt.items.find(item => item.id === itemID);

    const itemUpdatedTag = {
      id: itemToEdit.id,
      name: itemToEdit.name,
      price: itemToEdit.price,
      receipt_id: itemToEdit.receipt_id
    };

    for (let j = 0; j < $scope.allTags.length; j++) {
      if ($scope.allTags[j].tag === tagSelected) {
        itemUpdatedTag.tag_id = $scope.allTags[j].id;
        break;
      }
    }

    $http.patch(`${API_URL}/receipts/${receiptID}/items/${itemID}`, itemUpdatedTag).catch((err) => {
      console.error(err);
    });
  };

  $scope.editItems = function editItems() {

    const receiptID = $scope.receipt.id;
    const updatedItems = $scope.receipt.items;
    for (let i = 0; i < updatedItems.length; i++) {
      let editedItem = {
        id: updatedItems[i].id,
        name: updatedItems[i].name,
        price: updatedItems[i].price,
        receipt_id: updatedItems[i].receipt_id
      };

      for (let j = 0; j < $scope.allTags.length; j++) {
        if ($scope.allTags[j].tag === updatedItems[i].tag) {
          editedItem.tag_id = $scope.allTags[j].id;
          break;
        }
      }

      $http.patch(`${API_URL}/receipts/${receiptID}/items/${updatedItems[i].id}`, editedItem).catch((err) => {
        console.error(err);
      });
    }

  };

  $scope.newItem = {};

  $scope.addItem = function addItem() {

    let addedItem = {
      name: $scope.newItem.name,
      price: $scope.newItem.price,
      receipt_id: $scope.receipt.id
    };

    for (let i = 0; i < $scope.allTags.length; i++) {
      if ($scope.allTags[i].tag === $scope.newItem.tag) {
        addedItem.tag_id = $scope.allTags[i].id;
        break;
      }
    }

    $http.post(`${API_URL}/receipts/${addedItem.receipt_id}/items`, addedItem).then((response) => {}).catch((err) => {
      console.error(err);
    });

  };

  $scope.takePicture = function() {
    console.log('making it here');
    let options = {
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
  //set initial graph state
  const d = new Date;
  $scope.xMin = {
    value: 30
  };
  $scope.xminvalue = d.setDate(d.getDate() - $scope.xMin.value);
  $scope.xmaxvalue = new Date();
  $scope.xrange = d3.time.days($scope.xminvalue, $scope.xmaxvalue);

  $scope.options = {
    chart: {
      type: 'multiBarChart',
      showControls: false,
      stacked: true,
      height: 450,
      clipEdge: true,
      staggerLabels: false,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x(d) {
        return d3.time.format('%m/%d')(new Date(d.x))
      },
      showValues: true,
      showLegend: false,
      objectequality: true,
      duration: 500,
      xAxis: {
        axisLabel: 'Date',
        showMaxMin: true,
        tickInterval: 7,
        tickFormat(d) {
          return d3.time.format('%m/%d')(new Date(d));
        }
      },
      yAxis: {
        axisLabel: 'Total',
        axisLabelDistance: -10,
        height: 60,
        tickFormat(d) {
          return "$" + d3.format(",.2f")(d);
        }
      }
    }
  };

  $scope.data = [];
  //get receipt data from server
  $scope.getReceiptData = function() {
    $http.get('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/receipts/users/1').then(function(res) {
      $scope.receipts = res.data;
      $scope.selectedItems = JSON.parse(JSON.stringify(res.data));
      $scope.updateGraphData();
    });
  };
  $scope.getReceiptData();
  //update graph data with new range based on range control input
  $scope.updateRange = function() {
    const d = new Date;
    $scope.xminvalue = d.setDate(d.getDate() - $scope.xMin.value);
    $scope.xmaxvalue = new Date();
    $scope.xrange = d3.time.days($scope.xminvalue, $scope.xmaxvalue);
    $scope.updateGraphData();
    setInterval(function() {
      if (!$scope.run)
        return;
      $scope.$apply(); // update the chart
    }, 500);
  }
  //create and refresh graph data on change
  $scope.updateGraphData = function() {
    const data = [];
    $scope.data.splice(0, $scope.data.length)
    const v = [];
    $scope.xrange.forEach((i) => {
      const data = {};
      data.x = d3.time.format('%m/%d/%y')(new Date(i));
      data.y = 0;
      v.push(data);
    });
    $scope.selectedItems.forEach((receipt) => {
      const series = {}
      const seriesValues = [];

      v.forEach((item) => {
        const itemObj = {};
        if ((item.x) === d3.time.format('%m/%d/%y')(new Date(receipt.date))) {
          itemObj.x = item.x;
          itemObj.y = receipt.items.map(function(i) {
            return parseInt(i.price, 10);
          }).reduce((a, b) => {
            return a + b;
          });
        } else {
          itemObj.x = item.x;
          itemObj.y = 0;
        }
        seriesValues.push(itemObj);
      });
      series.key = receipt.location;
      series.values = seriesValues;
      data.push(series);
    });
    $scope.data = data.reduce((o, cur) => {
      const occurs = o.reduce((n, item, i) => {
        return (item.key === cur.key)
          ? i
          : n;
      }, -1);
      if (occurs > -1) {
        let values = []
        for (var i1 = 0; i1 < o[occurs].values.length; i1++) {
          for (var i2 = 0; i2 < cur.values.length; i2++) {
            if (o[occurs].values[i1].x === cur.values[i2].x) {
              values.push({
                x: o[occurs].values[i1].x,
                y: (o[occurs].values[i1].y + o[occurs].values[i2].y)
              });
            }
          }
        }
        o[occurs].values = values;
      } else {
        o = o.concat([cur]);
      }
      return o;
    }, []);
  }
  //create graph control modal
  $ionicModal.fromTemplateUrl('templates/graphControl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  //shows all items to remove from graph data
  $scope.showGraphControl = function(receipts) {
    $scope.receipts = receipts;
    $scope.modal.show();
  };

  //adds or removes items from graph data based on graphControl toggle
  $scope.toggleSelection = function(item) {
    let rI;
    let iI;

    $scope.selectedItems.forEach((rec) => {
      if (rec.id === item.receipt_id) {
        rI = $scope.selectedItems.indexOf(rec);
      }
    });

    $scope.selectedItems[rI].items.forEach((i) => {
      if (i.id === item.id) {
        iI = $scope.selectedItems[rI].items.indexOf(i);
      }
    });

    if (iI > -1) {
      $scope.selectedItems[rI].items.splice(iI, 1);
    } else {
      $scope.selectedItems[rI].items.push(item);
    }
    $scope.updateGraphData();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  }
});
