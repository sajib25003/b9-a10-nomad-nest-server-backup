const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId, Object } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ruowzmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("nomadUserDB").collection("user");
    const spotCollection = client.db("spotsDB").collection("spots");
    const countryCollection = client.db("countryDB").collection("country");

    app.get("/spots", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/spots/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await spotCollection.findOne(query);
        res.send(result);
      });

      app.get("/countries/:country", async (req, res) => {
        console.log(req.params.country);
        const result = await spotCollection
          .find({ country: req.params.country })
          .toArray();
        res.send(result);
      });
      
    // country
    app.get("/country", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/country/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await countryCollection.findOne(query);
        res.send(result);
      });

      

    // my list
    app.get("/myList/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await spotCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    

    app.post("/spots", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });

    app.put("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          tourist_spot_name: updatedSpot.tourist_spot_name,
          photoURL: updatedSpot.photoURL,
          country: updatedSpot.country,
          location: updatedSpot.location,
          description: updatedSpot.description,
          avgCost: updatedSpot.avgCost,
          seasonality: updatedSpot.seasonality,
          travelTime: updatedSpot.travelTime,
          visitorsNo: updatedSpot.visitorsNo,
        },
      };
      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result);
    });

    app.delete("/spots/:_id", async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    // user related APIs

    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Nomad Nest server is running");
});

app.listen(port, () => {
  console.log(`Nomad Nest is running on ${port}`);
});
