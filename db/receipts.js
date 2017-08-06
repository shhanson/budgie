const knex = require('./db');

function Receipts() {
  return knex('receipts');
}

Receipts.getAll = (userId, callback) => {
  Receipts().join('locations', 'receipts.location_id', 'locations.id').where('receipts.user_id', userId).then((receipts) => {
    if (!receipts) {
      const error = new Error('No receipts found for user.');
      error.status = 400;
      return callback(error);
    }
    knex('items').leftJoin('tags', 'items.tag_id', 'tags.id').whereIn('items.receipt_id', receipts.map(r => r.id)).then((items) => {
      const itemsByReceiptId = items.reduce((result, item) => {
        result[item.receipt_id] = result[item.receipt_id] || [];
        result[item.receipt_id].push(item);
        return result;
      }, {});
      receipts.forEach((receipt) => {
        receipt.items = itemsByReceiptId[receipt.id] || [];
      });
      callback(undefined, receipts);
    }).catch((err) => {
      console.log(err);
      callback(err);
    });
  });
};

Receipts.addNew = (data, userId, callback) => {
  const listItems = data.listItems;
  delete data.listItems;
  data.user_id = userId;
  Receipts().insert(data).returning('*').then((result) => {
    const receipt = result[result.length - 1];
    listItems.map((item) => {
      item.receipt_id = receipt.id;
    });
    knex('items').insert(listItems).returning('*').then((results) => {
      receipt.items = results;
      callback(undefined, receipt);
    }).catch((err) => {
      callback(err);
    });
  });
};

Receipts.getOne = (userId, callback) => {
  Receipts().where({id: userId}).first().returning('*').then((receipt) => {
    if (!receipt) {
      const error = new Error('Item does not exist.');
      error.status = 400;
      return callback(error);
    }
    knex('locations').where({id: receipt.id}).then((location) => {
      receipt.location_name = location.location;
    });
    callback(undefined, receipt);
  }).catch((err) => {
    callback(err);
  });
};

Receipts.updateReceipt = (receiptId, data, callback) => {
  Receipts().update(data).where({id: receiptId}).returning('*').then((receipt) => {
    callback(undefined, receipt[0]);
  }).catch((err) => {
    callback(err);
  });
};

Receipts.deleteReceipt = (receiptId, callback) => {
  Receipts().del().where({id: receiptId}).then(() => {
    callback(undefined, 'Item successfully deleted.');
  }).catch((err) => {
    callback(err);
  });
};
module.exports = Receipts;
Receipts;
