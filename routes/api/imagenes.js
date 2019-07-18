var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const Imagen = require('../../database/schema/imagen');

// lista de todas las imagenes
router.get("/", (req, res) => {
    Imagen.find().exec()
    .then(docs => {
      res.json({
        data: docs
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });
//Lista de las imagenes del usuario
router.get("/Usuario/:id", (req, res) => {
    Imagen.find({idUsuario:req.params.id}).exec()
    .then(docs => {
      res.json({
        data: docs
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });
//imagen mediante url
router.get("/:id", (req, res) => {
    Imagen.findOne({_id: req.params.id}).exec()
    .then(doc => {

      if(doc){//
        var img = fs.readFileSync("./" + doc.path);
        res.contentType('image/jpeg');
        if (path.extname(doc.path) == '.png') {
          res.contentType('image/png');
        }
        res.status(200).send(img);
      }
      else{
        res.status(424).json({
          "error": "Error de solicitud imagen eliminada"
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });

module.exports = router;
