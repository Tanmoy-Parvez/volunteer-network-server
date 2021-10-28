const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wh888.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("volunteerActivities");
        const eventsCollection = database.collection("events")

        // GET API to load all the events from database
        app.get("/events", async (req, res) => {
            const results = await eventsCollection.find({}).toArray();
            res.send(results);
        });

        app.get("/events/:id", async (req, res) => {
            const id = req.params.id;
            const results = await eventsCollection.findOne({ _id: ObjectId(id) });
            res.send(results);
        })
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Getting successfully");
});

app.listen(port, () => {
    console.log("listening on port", port);
});


