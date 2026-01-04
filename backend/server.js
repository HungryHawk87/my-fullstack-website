const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper function to read data
function readData() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper function to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running!' });
});

// POST endpoint to submit data
app.post('/api/submit', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Read existing data
        const data = readData();
        
        // Add new entry
        const newEntry = {
            id: Date.now(),
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };
        
        data.push(newEntry);
        
        // Save data
        writeData(data);
        
        res.status(201).json({ 
            message: 'Data saved successfully',
            data: newEntry 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET endpoint to retrieve all data
app.get('/api/data', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE endpoint to clear all data (optional)
app.delete('/api/data', (req, res) => {
    try {
        writeData([]);
        res.json({ message: 'All data cleared' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});