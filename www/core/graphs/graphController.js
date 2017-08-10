angular.module('budgie.graphs', []).controller('GraphCtrl', function($scope, $http, $ionicModal, UserService, $state) {
  //set initial graph state
  // $state.go($state.current, {}, {reload: true});
  $scope.user = UserService.currentUser;
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
      showLegend: true,
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
    $http.get(`http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/receipts/users/${$scope.user.id}`).then(function(res) {
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
                y: (o[occurs].values[i1].y + cur.values[i2].y)
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
  $ionicModal.fromTemplateUrl('core/graphs/graphControl.html', {
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
