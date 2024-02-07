const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const client = new MongoClient(uri);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

  async function connect() {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }
  connect();

  app.get('/api/data', async (req, res) => {
    try {
      const database = client.db('study_project'); 
      const collection = database.collection('users'); // Replace with your MongoDB collection name

      const data = await collection.find({}).toArray();
      console.log(data)
      res.json(data);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.post('/api/insert', async (req, res) => {
  try {
    const database = client.db('study_project'); 
    const collection = database.collection('users'); // Change 'mycollection' to your collection name

    const data = req.body; // Assuming the request body contains JSON data to be inserted into MongoDB
    console.log("data",data)
    const result = await collection.insertOne(data);
    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/', (req, res) => {
  res.send('Hello, Node.js!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
