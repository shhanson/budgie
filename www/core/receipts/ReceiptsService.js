angular.module('budgie.services', []).service('ReceiptsService', [
  '$http',
  function service($http) {
    const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";
    const self = this;

    self.receipts = [];

    self.getReceipts = function getReceipts(userID) {
      return $http.get(`${API_URL}/receipts/users/${userID}`).then((response) => {
        self.receipts = response.data.map((r) => {
          let date = new Date(r.date);
          r.month = date.getMonth() + 1;
          return r;
        });
      }).catch((err) => {
        // console.error(err);
      });
    };

    self.getReceipt = function getReceipt(receiptID) {
      return $http.get(`${API_URL}/receipts/${receiptID}`).catch((err) => {
        // console.error(err);
      });
    }

    self.deleteReceipt = function deleteReceipt(receiptID) {
      $http.delete(`${API_URL}/receipts/${receiptID}`).then(() => {

        for (let i = 0; i < self.receipts.length; i++) {
          if (self.receipts[i].id === receiptID) {
            self.receipts.splice(i, 1);
            return;
          }
        }
      }).catch((err) => {
        // console.error(err);
      });
    };

    self.addReceipt = function addReceipt(userID, newReceipt) {
      $http.post(`${API_URL}/receipts/users/${userID}`, newReceipt).then((response) => {
        self.receipts.push(response.data);
      }).catch((err) => {
        // console.error(err);
      });

    };

    self.editReceipt = function editReceipt(receiptID, editedReceipt) {
      $http.patch(`${API_URL}/receipts/${receiptID}`, editedReceipt).then((response) => {
        for (let i = 0; i < self.receipts.length; i++) {
          if (self.receipts[i].id === receiptID) {
            self.receipts[i] = response.data;
            return;
          }
        }
      }).catch((err) => {
        // console.error(err);
      });

    };

  }
]);
