const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";

angular.module('starter.services', []).service('ReceiptsService', [
  '$http',
  function service($http) {
    const self = this;

    self.receipts = [];

    self.getReceipts = function getReceipts(userID) {
      return $http.get(`${API_URL}/receipts/users/${userID}`).then((response) => {
        self.receipts = response.data;
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
]).service('ItemsService', [
  '$http',
  function service($http) {
    const self = this;

    self.items = [];

    self.getItems = function getItems(receiptID) {
      return $http.get(`${API_URL}/${receiptID}/items`).then((response) => {
        self.items = response.data;
      }).catch((err) => {
        console.error(err);
      });
    };

    self.getItem = function getItem(receiptID, itemID) {
      return $http.get(`${API_URL}/${receiptID}/items/${itemID}`).catch((err) => {
        console.error(err);
      });
    };

    self.addItem = function addItem(receiptID, newItem) {
      $http.post(`${API_URL}/${receiptID}/items`, newItem).then((response) => {
        self.receipts.push(response.data);
      }).catch((err) => {
        console.error(err);
      });
    };

    self.deleteItem = function deleteItem(receiptID, itemID) {
      $http.delete(`${API_URL}/${receiptID}/items/${itemID}`).then(() => {
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
      $http.patch(`${API_URL}/${receiptID}/items/${itemID}`, editedReceipt).then((response) => {
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

// .factory('Chats', function() {
//   // Might use a resource here that returns a JSON array
//
//   // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'img/ben.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'img/max.png'
//   }, {
//     id: 2,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'img/adam.jpg'
//   }, {
//     id: 3,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'img/perry.png'
//   }, {
//     id: 4,
//     name: 'Mike Harrington',
//     lastText: 'This is wicked good ice cream.',
//     face: 'img/mike.png'
//   }];
//
//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   };
// });
