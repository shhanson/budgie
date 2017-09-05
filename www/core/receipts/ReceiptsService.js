angular.module('budgie').service('ReceiptsService', [
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
      });
    };

    self.getReceipt = function getReceipt(receiptID) {
      return $http.get(`${API_URL}/receipts/${receiptID}`).then(() => {})
    }

    self.deleteReceipt = function deleteReceipt(receipt) {
      return $http.delete(`${API_URL}/receipts/${receipt.id}`).then(() => {
        const index = self.receipts.indexOf(receipt)
        self.receipts.splice(index, 1);
        return;
      });
    };

    self.addReceipt = function addReceipt(newReceipt, userID) {
      return $http.post(`${API_URL}/receipts/users/${userID}`, newReceipt).then((response) => {
        self.receipts.push(response.data);
      });
    };

    self.editReceipt = function editReceipt(receipt) {
      return $http.patch(`${API_URL}/receipts/${receipt.id}`, receipt).then(() => {});
    };
  }
]);
