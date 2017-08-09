angular.module('budgie.itemService', []).service('ItemsService', [
  '$http',
  function service($http) {
    const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";
    const self = this;

    self.items = [];

    self.getItems = function getItems(receiptID) {
      return $http.get(`${API_URL}/receipts/${receiptID}/items`).then((response) => {
        self.items = response.data;
        return response.data;
      }).catch((err) => {
        console.error(err);
      });
    };

    self.getItem = function getItem(receiptID, itemID) {
      return $http.get(`${API_URL}/receipts/${receiptID}/items/${itemID}`).catch((err) => {
        console.error(err);
      });
    };

    self.addItem = function addItem(receiptID, newItem) {
      $http.post(`${API_URL}/receipts/${receiptID}/items`, newItem).then((response) => {
        self.receipts.push(response.data);
      }).catch((err) => {
        console.error(err);
      });
    };

    self.deleteItem = function deleteItem(receiptID, itemID) {
      $http.delete(`${API_URL}/receipts/${receiptID}/items/${itemID}`).then(() => {
        for (let i = 0; i < self.items.length; i++) {
          if (self.items[i].id === itemID) {
            self.items.splice(i, 1);
            return;
          }
        }
      }).catch((err) => {
        console.error(err);
      });
    };

    self.editItem = function editItem(receiptID, itemID, editedItem) {
      console.log("EDITING");
      $http.patch(`${API_URL}/receipts/${receiptID}/items/${itemID}`, editedReceipt).then((response) => {
        for (let i = 0; i < self.items.length; i++) {
          if (self.items[i].id === itemID) {
            self.items[i] = response.data;
            return;
          }
        }
      }).catch((err) => {
        console.error(err);
      });
    };
  }
]);
