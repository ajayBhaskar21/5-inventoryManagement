const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Item Schema
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Routes
// Add a new item
app.post('/api/items', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Error adding item', error: err });
    }
});

// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching items', error: err });
    }
});

// Update an item's quantity
app.put('/api/items/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const item = await Item.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Error updating item', error: err });
    }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting item', error: err });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
