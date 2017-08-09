angular.module('budgie.loginServices', []).service('LoginService', [
  '$http',
  function service($http) {
    const self = this;

    self.receipts = [];

    self.getReceipts = function getReceipts(userID) {
      return $http.get(`${API_URL}/receipts/users/${userID}`).then((response) => {
        self.receipts = response.data;
        console.log(response.data);
      }).catch((err) => {
        console.error(err);
      });
    };

    self.getReceipt = function getReceipt(receiptID) {
      return $http.get(`${API_URL}/receipts/${receiptID}`).catch((err) => {
        console.error(err);
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
        console.error(err);
      });
    };

    self.addReceipt = function addReceipt(userID, newReceipt) {
      $http.post(`${API_URL}/receipts/users/${userID}`, newReceipt).then((response) => {
        self.receipts.push(response.data);
      }).catch((err) => {
        console.error(err);
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
        console.error(err);
      });
    };
  }
]);
