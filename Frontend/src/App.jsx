
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    // Fetch items
    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/items');
            setItems(response.data);
        } catch (err) {
            console.error('Error fetching items:', err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Add a new item
    const addItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/items', { name, quantity, price });
            setName('');
            setQuantity(0);
            setPrice(0);
            fetchItems();
        } catch (err) {
            console.error('Error adding item:', err);
        }
    };

    // Update quantity
    const updateQuantity = async (id, newQuantity) => {
        try {
            await axios.put(`http://localhost:5000/api/items/${id}`, { quantity: newQuantity });
            fetchItems();
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    // Delete an item
    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`);
            fetchItems();
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    // Calculate total inventory value
    const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Inventory Management</h1>

            <form onSubmit={addItem} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    style={{ marginRight: '10px' }}
                />
                <button type="submit">Add Item</button>
            </form>

            <h2>Total Inventory Value: ${totalValue.toFixed(2)}</h2>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {items.map((item) => (
                    <li key={item._id} style={{ marginBottom: '10px' }}>
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>Increase</button>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>Decrease</button>
                        <button onClick={() => deleteItem(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;

