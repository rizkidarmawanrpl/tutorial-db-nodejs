const express     = require('express');
const {MongoClient} = require('mongodb');
const url         = 'mongodb://0.0.0.0:27017';
const client      = new MongoClient(url);
const dbName      = 'mydb';
require('dotenv').config();

const port     = process.env.APP_PORT;
// const host     = process.env.DB_HOST;
// const database = process.env.DB_DATABASE;
// const user     = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;
const app      = express();

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");

async function main() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');

    try {
        // await collection.insertOne({_id: 1, nama: 'Rizki Darmawan'}, function (err, result) {
        //     if (err) throw err;
        //     console.log('Document inserted');
        // });

        // await collection.insertMany([{_id: 2, nama: 'Aulia Rahmansyah'}, {_id: 3, nama: 'Ekky Ardian'}], function (err, result) {
        //     if (err) throw err;
        //     console.log('Document inserted');
        // });

        // const indexName = await collection.createIndex({ a: 1 });
        // await collection.createIndex({ a: 2 });
        // await collection.createIndex({ a: 3 });
        // console.log('index name =', indexName);

        // Update a document
        // collection.updateOne({a: 1}, {$set: {b: 2}}, function (err, result) {
        //     if (err) throw err;
        //     console.log('Document updated');
        // });

        // Delete a document
        // collection.deleteOne({a: 1}, function (err, result) {
        //     if (err) throw err;
        //     console.log('Document deleted');
        // });

        collection.deleteMany({}, function (err, result) {
            if (err) throw err;
            console.log('Document deleted');
        });

        // const deleteResult = await collection.deleteMany({a: 1});
        // await collection.deleteMany({a: 2});
        // await collection.deleteMany({a: 3});
        // console.log('Deleted documents =>', deleteResult);

        // Find documents
        // collection.find({}).toArray(function (err, docs) {
        //     if (err) throw err;
        //     console.log('Found the following documents');
        //     console.log(docs);
        // });

        const findResult = await collection.find({}).toArray();
        console.log('Found documents =>', findResult);

        findResult.map((item, index) => {
            console.log(item.nama);
        });
    } catch (error) {
        if (error instanceof MongoServerError) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }

    return 'done.';
}

main()
.then(console.log)
.catch(console.error)
.finally(() => client.close());

app.listen(port, () => {
    console.log("server ready...");
});