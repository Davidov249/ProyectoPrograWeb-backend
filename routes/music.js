var express = require('express');
var router = express.Router({mergeParams: true});
/*const redis = require('redis');
const redisClient = redis.createClient(6379);*/
const assert = require('assert');
fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DBSTRING;
const ObjectID = require('mongodb').ObjectID;

/* GET specific song */
router.get('/one/:id', async function(req, res, next) {

    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var songid = req.params.id;

    try {
        await client.connect();
        //redisClient.SADD

        const result = await client.db("PrograWeb").collection("Music").find({"_id" : ObjectID(songid)}).toArray();
        if (result.length > 0){
            res.status(200).json({result}).send();
        } else {
            res.status(404).json({message: "No se encontro la cancion"}).send();
        }
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});

/* GET user playlist */
router.get('/:userid', async function(req, res, next) {
    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var userid = req.params.userid;

    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").find({"userid" : userid}).toArray();
        //result.shift();
        if (result.length > 0){
            res.status(200).json(result).send();
        } else {
            res.status(404).json({message: "No se encontro la playlist"}).send();
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

/* POST song */
router.post('/', async function(req, res, next) {

    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var song = {
        "userid": req.body.userid,
        "name": req.body.name,
        "author": req.body.author,
        "genre": req.body.genre,
        "length": req.body.length
    }
    try {
        await client.connect();

        const result = await client.db("PrograWeb").collection("Music").insertOne(song);
        res.status(201).send();
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});

/* PUT(update) specific song */
router.put('/:id', async function(req, res, next) {
    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

    var songid = req.params.id;
    var song = {
        "userid": req.body.userid,
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

/* DELETE specific song */
router.delete('/:id', async function(req, res, next) {

    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
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