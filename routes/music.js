var express = require('express');
var router = express.Router({mergeParams: true});
fs = require('fs');
let listado = new Map();
fs.readFile('/home/david/Proyects/ProyectoPrograWeb/prograweb-backend/prograweb-backend/routes/listado.json'
    , 'utf8', function (err, data) {
        //console.log(data)
  if (err) {
    return console.log(err);
  }
  var list = JSON.parse(data);
  //console.log(list[0]);
  for (i=0; i<list.length; i++){
      listado.set(list[i].id, list[i]);
  }
  //console.log(listado);
})

/* GET specific song */
router.get('/:id', function(req, res, next) {
    var songid = parseInt(req.params.id);
    console.log(listado);
    if (listado.has(songid)){
        res.status(200).json(listado.get(songid)).send();
    }else{
        res.status(404).send();
    }
});

/* GET list of songs */
router.get('/', function(req, res, next) {
    var string = [];
        for (var [clave, valor] of listado) {
            string.push(listado.get(clave));
        }
        //console.log(string)
        res.status(200).json(string).send();
});

router.get('/test/:id', function(req, res, next) {
    res.end(req.params.id).send();
})

router.post('/', function(req, res, next) {
    var response = {
            "id": req.body.id,
            "name": req.body.name,
            "author": req.body.author,
            "genre": req.body.genre,
            "length": req.body.length
    }
    var song = req.body;
    listado.set(req.body.id, response);
    res.status(201).send();
});
  
router.put('/:id', function(req, res, next) {
    if(listado.has(parseInt(req.params.id))){
        listado.set(parseInt(req.params.id), req.body);
        res.status(204).send();
    }else{
        res.status(404).send();
    }
});
  
router.delete('/:id', function(req, res, next) {
    if(listado.delete(parseInt(req.params.id))){
        res.status(204).send();
    }else{
        res.status(404).send();
    }
});
  
module.exports = router;