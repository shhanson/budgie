const knex = require('./db');

function Items() {
  return knex('items');
}

Items.getAll = (receiptId, callback) => {
  Items().leftJoin('tags', 'items.tag_id', 'tags.id').where({ receipt_id: receiptId }).then((items) => {
    if (!items) {
      const error = new Error('No items found matching this receipt.');
      error.status = 400;
      return callback(error);
    }
    callback(undefined, items);
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
};

Items.addNew = (data, receiptId, callback) => {
  const tagID = data.tag_id
    ? data.tag_id
    : '';
  Items().insert({ name: data.name, price: data.price, tag_id: tagID, receipt_id: receiptId }).returning('*').then((item) => {
    callback(undefined, item);
  }).catch((err) => {
    callback(err);
  });
};

Items.getOne = (itemId, callback) => {
  Items().leftJoin('tags', 'items.tag_id', 'tags.id').where('items.id', itemId).first().returning('*').then((item) => {
    if (!item) {
      const error = new Error('Item does not exist.');
      error.status = 400;
      return callback(error);
    }
    callback(undefined, item);
  }).catch((err) => {
    callback(err);
  });
};

Items.updateItem = (itemId, data, callback) => {
  Items().update(data).where({ id: itemId }).then(() => {
    Items().leftJoin('tags', 'items.tag_id', 'tags.id').where('items.id', itemId).first().returning('*').then((item) => {
      callback(undefined, item);
    });
  }).catch((err) => {
    callback(err);
  });
};

Items.deleteItem = (itemId, callback) => {
  Items().del().where({ id: itemId }).then(() => {
    callback(undefined, 'Item successfully deleted.');
  }).catch((err) => {
    callback(err);
  });
};
module.exports = Items;
