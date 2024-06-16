const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const collection = db.collection('items');


async function getAllItems() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
}

async function getItemById(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return {id: doc.id, ...doc.data()};
}

async function createItem(item) {
  await collection.doc(item.id).set(item);
  return item;
}

async function updateItem(id, updatedItem) {
  const doc = await firestore.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  await collection.doc(id).update(updatedItem);
  return {id, ...updatedItem};
}

async function deleteItem(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  await collection.doc(id).delete();
  return true;
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};

