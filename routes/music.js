var express = require('express');
var router = express.Router({mergeParams: true});
const assert = require('assert');
fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DBSTRING;
const ObjectID = require('mongodb').ObjectID;

/* GET specific song */
router.get('/:id', async function(req, res, next) {

    const client = new MongoClient(url);
    var songid = req.params.id;

    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").find({"_id" : ObjectID(songid)}).toArray();
        if (result.length > 0){
            res.status(201).json({result}).send();
        } else {
            res.status(404).json({message: "No se encontro la cancion"}).send();
        }
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});

/* GET list of songs */
router.get('/', async function(req, res, next) {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").find().toArray();
        console.log(result);
        result.shift();
        if (result.length > 0){
            res.status(201).json({data : result}).send();
        } else {
            res.status(404).json({message: "No se encontro la cancion"}).send();
        }
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});

router.get('/test/:id', function(req, res, next) {
    res.end(req.params.id).send();
})

router.post('/', async function(req, res, next) {

    const client = new MongoClient(url);
    var song = {
        "name": req.body.name,
        "author": req.body.author,
        "genre": req.body.genre,
        "length": req.body.length
    }
    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").insertOne(song);
        console.log(result);
        res.status(201).send();
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});
  
router.put('/:id', async function(req, res, next) {
    const client = new MongoClient(url);

    var songid = req.params.id;
    var song = {
        "name": req.body.name,
        "author": req.body.author,
        "genre": req.body.genre,
        "length": req.body.length
    }

    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").replaceOne({"_id" : ObjectID(songid)},song);

        if (result.matchedCount !== 0){
            res.status(202).json({Message : "La cancion se actualizo con exito"}).send();
        } else {
            res.status(404).json({Message : "No se encontro la cancion"}).send();
        }
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});
  
router.delete('/:id', async function(req, res, next) {

    const client = new MongoClient(url);
    var songid = req.params.id;

    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").deleteOne({"_id" : ObjectID(songid)});
        if (result.deletedCount !== 0){
            res.status(202).json({Message : "La cancion se borro con exito"}).send();
        } else {
            res.status(404).json({Message : "No se encontro la cancion"}).send();
        }
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});
  
module.exports = router;