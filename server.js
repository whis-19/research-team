const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'research_survey';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'responses';

let db;
let collection;

async function connectDB() {
    try {
        // Added tlsAllowInvalidCertificates=true to bypass SSL errors for local dev as requested
        const client = new MongoClient(MONGO_URI, {
            tlsAllowInvalidCertificates: true
        });

        await client.connect();
        console.log(`Connected to MongoDB: ${DB_NAME}.${COLLECTION_NAME}`);

        db = client.db(DB_NAME);
        collection = db.collection(COLLECTION_NAME);

        // Create index on submitted_at
        await collection.createIndex({ submitted_at: 1 });
        console.log("Index on 'submitted_at' verified/created.");

    } catch (err) {
        console.error('Failed to connect to MongoDB. Starting server anyway...', err.message);
        // Do not process.exit(1), let local server run without DB
        db = null;
        collection = null;
    }
}

// Routes

// API to submit survey
app.post('/submit-survey', async (req, res) => {
    try {
        const data = req.body;

        // Add timestamp
        data.submitted_at = new Date();

        // Save to MongoDB
        let insertedId = null;
        if (collection) {
            const result = await collection.insertOne(data);
            insertedId = result.insertedId;
        } else {
            console.log('Mock save response (MongoDB not connected):', data);
            insertedId = 'mock-id-' + Date.now();
        }

        res.status(201).json({
            message: 'Survey submitted successfully!',
            id: insertedId
        });
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ error: 'An error occurred while saving your response.' });
    }
});

// Pass specific files to ensure routing works for these pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/survey.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'survey.html'));
});

app.get('/guidance.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'guidance.html'));
});

// Start Server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
