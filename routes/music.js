var express = require('express');
var router = express.Router({mergeParams: true});
const assert = require('assert');
fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DBSTRING;
const ObjectID = require('mongodb').ObjectID;

/* GET specific song */
/**

 * @swagger

 * /one/{id}:
 *  get:
 *    summary: Retrieve a specific song from the playlist.
 *    tags: [Music]
 *    description: Retrieve the specified song from the user playlist.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Song id of the specific song.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The specified song.
 *      403:
 *        description: Unauthorized
 *      404:
 *        description: Song not Found
 *      500:
 *        description: Internal Server Error
 */
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
/**

 * @swagger

 * /{userid}:
 *  get:
 *    summary: Retrieve users playlist.
 *    tags: [Music]
 *    description: Retrieve the users playlist.
 *    parameters:
 *      - in: path
 *        name: userid
 *        required: true
 *        description: User id.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The user playlist.
 *      403:
 *        description: Unauthorized
 *      404:
 *        description: Playlist not Found
 *      500:
 *        description: Internal Server Error
 */
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
/**
 
 * @swagger

 * /:
 *  post:
 *    summary: Add a song to user playlist.
 *    tags: [Music]
 *    requestBody:
 *      description: Create a json that represents a song you want to add to your playlist.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userid:
 *                type: string
 *                description: The user ID.
 *                example: 31f8349f-7edd-47d6-a11d-81384559c84f
 *              name:
 *                type: string
 *                description: The song name.
 *                example: Another one bites the dust
 *              author:
 *                type: string
 *                description: The name of the song author.
 *                example: Survivor
 *              genre:
 *                type: string
 *                descritpion: The genre of the song.
 *                example: Rock
 *              length:
 *                type: string
 *                descritpion: The length of the song.
 *                example: Rock
 *    responses:
 *      201:
 *        description: The song was added to your playlist
 *      403:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 */
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
        console.log("llego al post")
        res.status(201).send();
    } catch (e) {
        res.status(500).json({Error: "Valio madres todo", Message: e.message}).send();
    } finally {
        await client.close();
    }
});

/* PUT(update) specific song */
/**
 
 * @swagger

 * /{id}:
 *  put:
 *    summary: Add a song to user playlist.
 *    tags: [Music]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Song id.
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Create a json that represents a song you want to add to your playlist.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userid:
 *                type: string
 *                description: The user ID.
 *                example: 31f8349f-7edd-47d6-a11d-81384559c84f
 *              name:
 *                type: string
 *                description: The song name.
 *                example: Another one bites the dust
 *              author:
 *                type: string
 *                description: The name of the song author.
 *                example: Survivor
 *              genre:
 *                type: string
 *                descritpion: The genre of the song.
 *                example: Rock
 *              length:
 *                type: string
 *                descritpion: The length of the song.
 *                example: Rock
 *    responses:
 *      202:
 *        description: The song was added to your playlist
 *      403:
 *        description: Unauthorized
 *      404:
 *        description: Song not found
 *      500:
 *        description: Internal Server Error
 */
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
/**

 * @swagger

 * /{id}:
 *  delete:
 *    summary: Deletes song.
 *    tags: [Music]
 *    description: Deletes song from user playlist.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Song id.
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: The song is deleted from playlist.
 *      403:
 *        description: Unauthorized
 *      404:
 *        description: Playlist not Found
 *      500:
 *        description: Internal Server Error
 */
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