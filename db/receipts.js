const knex = require('./db');

function Receipts() {
  return knex.select(['receipts.id', 'receipts.date', 'receipts.location_id', 'receipts.user_id', 'locations.location']).from('receipts');
}

function Items() {
  return knex.select(['items.id', 'items.name', 'items.price', 'items.receipt_id', 'tags.tag']).from('items');
}

Receipts.getAll = (userId, callback) => {
  Receipts().join('locations', 'receipts.location_id', 'locations.id').where('receipts.user_id', userId).returning('*').then((receipts) => {
    console.log(receipts);
    if (!receipts) {
      const error = new Error('No receipts found for user.');
      error.status = 400;
      return callback(error);
    }
    Items().leftJoin('tags', 'items.tag_id', 'tags.id').whereIn('items.receipt_id', receipts.map(r => r.id)).then((items) => {
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
  knex('receipts').insert(data).returning('*').then((result) => {
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

Receipts.getOne = (receiptId, callback) => {
  Receipts().join('locations', 'receipts.location_id', 'locations.id').where('receipts.id', receiptId).first().returning('*').then((receipt) => {
    if (!receipt) {
      const error = new Error('Item does not exist.');
      error.status = 400;
      return callback(error);
    }
    Items().leftJoin('tags', 'items.tag_id', 'tags.id').where('items.receipt_id', receipt.id).then((items) => {
      receipt['items'] = items || [];
      callback(undefined, receipt);
    }).catch((err) => {
      callback(err);
    });
  });
};

Receipts.updateReceipt = (receiptId, data, callback) => {
  knex('receipts').update(data).where({id: receiptId}).then(() => {
    Receipts().join('locations', 'receipts.location_id', 'locations.id').where('receipts.id', receiptId).first().returning('*').then((receipt) => {
      if (!receipt) {
        const error = new Error('Item does not exist.');
        error.status = 400;
        return callback(error);
      }
      Items().leftJoin('tags', 'items.tag_id', 'tags.id').where('items.receipt_id', receipt.id).then((items) => {
        receipt['items'] = items || [];
        callback(undefined, receipt);
      })
    }).catch((err) => {
      callback(err);
    });
  });
};

Receipts.deleteReceipt = (receiptId, callback) => {
  knex('receipts').del().where({id: receiptId}).then(() => {
    callback(undefined, 'Item successfully deleted.');
  }).catch((err) => {
    callback(err);
  });
};
module.exports = Receipts;
Receipts;
