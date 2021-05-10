const redis = require('redis');
const redisClient = redis.createClient(6379);

const redisMiddleware = async (req, res, next) => {
    let url = req.url;
    let method = req.method;
    let body = req.body
    console.log(body)

    if(method === "POST") {
        //agregar cancion a redis
        redisClient.sadd(req.body.userid+":playlist", req.body, (err, data) => {
            next()
        })
    } else if (method === "PUT") {
        //actualizar cancion en redis
    } else if (method === "DELETE") {
        //borrar cancion en redis
    } else if (method === "GET") {
        if (url.includes("one")) {
            //buscar cancion especificad
            console.log("entro al get especifico")
        } else {
            //buscar playlist de canciones
            console.log("entro al get general")
        }
    } else {
        //Request erronea, lanzar error
    }

    next();
}

module.exports = {redisMiddleware};