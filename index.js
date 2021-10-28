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
        const eventsCollection = database.collection("events");
        const registerCollection = database.collection("register");

        // GET API to load all the events from database
        app.get("/events", async (req, res) => {
            const results = await eventsCollection.find({}).toArray();
            res.send(results);
        });
        // load single event
        app.get("/events/:id", async (req, res) => {
            const id = req.params.id;
            const results = await eventsCollection.findOne({ _id: ObjectId(id) });
            res.send(results);
        })
        // POST API
        app.post("/event", async (req, res) => {
            const event = req.body;
            const results = await registerCollection.insertOne(event);
            console.log(req.body);
            res.send(results);
        })
        // GET API to load all the register events from database
        app.get("/registerEvents/:email", async (req, res) => {
            const email = req.params.email;
            console.log(req.params.email);
            const results = await registerCollection.find({ email: (email) }).toArray();
            res.send(results);
        });
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


