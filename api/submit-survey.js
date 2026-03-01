const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'research-survey';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'responses';

let cachedClient = null;

async function connectDB() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

module.exports = async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = await connectDB();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const data = req.body;
        data.submitted_at = new Date();

        const result = await collection.insertOne(data);

        return res.status(201).json({
            message: 'Survey submitted successfully!',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error submitting survey:', error);
        return res.status(500).json({ error: 'An error occurred while saving your response.' });
    }
}
