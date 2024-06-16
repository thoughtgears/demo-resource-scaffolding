const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const dotenv = require('dotenv');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('./firestore');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Get all items
app.get('/items', async (req, res) => {
  try {
    const data = await getAllItems();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get item by ID
app.get('/items/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create item
app.post('/items', async (req, res) => {
  const item = {id: uuidv4(undefined, undefined, undefined), ...req.body};
  try {
    const newItem = await createItem(item);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update item
app.put('/items/:id', async (req, res) => {
  const {id} = req.params;
  const updatedItem = {...req.body};
  try {
    const item = await updateItem(id, updatedItem);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const success = await deleteItem(id);
    if (!success) {
      return res.status(404).send('Item not found');
    }
    res.send('Item deleted');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
