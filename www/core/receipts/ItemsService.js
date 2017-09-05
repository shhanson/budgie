angular.module('budgie').service('ItemsService', [
  '$http',
  function service($http) {
    const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";
    const self = this;

    self.items = [];
    self.tags = [];

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
      return $http.post(`${API_URL}/receipts/${receiptID}/items`, newItem).then((response) => {
        self.receipts.push(response.data);
      }).catch((err) => {
        console.error(err);
      });
    };

    self.deleteItem = function deleteItem(item) {
      return $http.delete(`${API_URL}/receipts/${item.receipt_id}/items/${item.id}`).then(() => {
        const index = self.items.indexOf(item);
        self.items.splice(index, 1);
        return;
      }).catch((err) => {
        console.error(err);
      });
    };

    self.editItem = function editItem(item) {
      return $http.patch(`${API_URL}/receipts/${item.receipt_id}/items/${item.id}`, item).then((response) => {
        const index = self.items.indexOf(item);
        self.items[index] = response.data;
        return;
      }).catch((err) => {
        console.error(err);
      });
    };

    self.getTags = function(userID) {
      return $http.get(`${API_URL}/tags/users/${userID}`).then((res) => {
        self.tags = res.data;
      });
    }

    self.addTag = function(userID, tag) {
      return $http.post(`${API_URL}/tags/users/${userID}`, tag).then((res) => {
        self.tags.push(res.data[0]);
        return res.data[0];
      });
    }
  }
]);
