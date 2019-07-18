var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt=require('jsonwebtoken');
const authorization=require('./middleware/auth');
//const ObjectId = require('mongoose').Types.ObjectId;
const sha1 = require('sha1');

const Usuario = require('../../database/schema/user');
const Imagen = require('../../database/schema/imagen');


const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        try {
            fs.statSync('./uploads/');
        } catch (e) {
            fs.mkdirSync('./uploads/');
        }
        cb(null, './uploads/');
    },
    filename: (res, file, cb) => {
        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
        return cb(null, true);
    }
    return cb(new Error('Solo imagenes con extencion png, jpg y jpeg'));
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}).single('imagen');

// Agregar avatar al usuario
router.post("/imagen/:id", (req, res) => {
    console.log(req.body);
    upload(req, res, (error) => {
      if(error){
        return res.status(500).json({
          "error" : error.message

        });
      }else{
        if (req.file == undefined) {
          return res.status(400).json({
            "error" : 'Imagen no recibida'

          });
        }
        var img = {
          name : req.file.originalname,
          idUsuario: req.params.id,
          path : req.file.path,
        };
        var modelImagen = new Imagen(img);
        modelImagen.save()
          .then( (result) => {
            return Usuario.findByIdAndUpdate(req.params.id,{avatar:'/api/imagenes/' + result._id}).exec()
          })
          .then(result => {
            res.status(201).json({message: 'Imagen agregada correctamente',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });
      }
    });
  });

//muestra registro del usuario
router.get('/', function (req, res, next) {
  Usuario.find().select('-__v -password -fechaRegistro').exec().then(docs => {
    if(docs.length == 0){
      return res.status(404).json({message: 'usuarios inexistentes'});
    }
    res.json(docs);
  })
  .catch(err => {
      res.status(500).json({
          error: err.message
      })
  });
});
router.get('/:id', function (req, res, next) {
  Usuario.findOne({_id:req.params.id}).select('-__v -password -fechaRegistro').exec().then(doc => {
    if(doc == null){
      return res.status(404).json({message: 'usuario inexistente'});
    }
    res.json(doc);
  })
  .catch(err => {
      res.status(500).json({
          error: err.message
      })
  });
});

// Registro de un nueco usuario
router.post('/', function (req, res, next) {
    Usuario.findOne({email:req.body.email})//verifica que no exista mismo correo
    .exec()
    .then(doc => {

      if (doc != null) {
        return res.status(401).json({error:'el correo esta en uso '});
      }
      const datos = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        sexo:req.body.sexo,
        lat: req.body.lat,
        lon: req.body.lon,
        tipo: req.body.tipo,
      };
      if (req.body.password == undefined || req.body.password == '') {
        return res.status(401).json({
          error: 'ingrese la contraseña'
        })
      }
      datos.password = sha1(req.body.password);
      var modelUsuario = new Usuario(datos);
      return modelUsuario.save()

    }).then((result) => {
      res.json({
          message: "Registro exitoso",
          result
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
});
//login del usuario existente
router.post('/login', (req, res, next) => {
    Usuario.find({
            email: req.body.email
        }).exec().then(user => {
          console.log(req.body);
            if (user.length < 1) {
                return res.status(401).json({
                    error: "Usuario inexistente"
                });
            }
            if (sha1(req.body.password)!= user[0].password) {
                return res.status(400).json({
                    error: "contraseña mal escrita, vuelva a intentarlo "
                });
            }else{
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                    },
                    process.env.JWT_KEY || 'secret321', {
                        expiresIn: "2h"
                    });

                return res.status(200).json({
                    message: "Acceso correcto",
                    tipo: user[0].tipo,
                    token,
                    id:user[0]._id
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
//login con Google
router.post('/logingoogle',(req,res)=>{
    const token=jwt.sign({
              email:req.body.email
            },process.env.JWT_KEY||'miClave',{
              expiresIn:"2h"
            });
    res.status(200).json({
      message:token
    });
});
/////
router.patch('/:id', function (req, res, next) {
    let idUsuario = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
      if (key != 'email' || key != 'tipo'|| key != 'sexo') {
        datos[key] = req.body[key];
      }
    });
    //console.log(datos);
    Usuario.updateOne({_id: idUsuario}, datos).exec()
        .then(result => {
          let message = 'Datos actualizados';
          if (result.ok == 0) {
              message = 'Verifique los datos, no se realizaron cambios';
          }
          if (result.ok == 1 && result.n == 0) {
              message = 'No se encontro el recurso';
          }
          if (result.ok == 1 && result.n == 1 && result.nModified == 0) {
              message = 'Se recibieron los mismos datos antiguos,no se realizaron cambios';
          }
          res.json({
              message,
              result
          });
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;
