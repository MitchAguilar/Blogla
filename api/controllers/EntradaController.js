/**
 * EntradaController
 *
 * @description :: Server-side logic for managing entradas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* momentjs */
var moment = require('moment');
moment.locale('es');

module.exports = {
  nuevo: function(req, res) { //Abre el formulario de registrar Entrada
    CategoriaEntrada.find(function CategoriaEntradaFounded(err, values) {
      if (err) {
        console.log('Error al consultar las categorias de las entradas. ' + err);
        return next(err);
      }
      console.log("Se han consultado " + (values.length) + " categorias de entrada");
      res.view({
        categorias: values,
        direccion: 'create'
      });
    });
  },
  ocultar: function (req, res) {
    console.log("Ocultando: " + req.param('id'));
    /*if (req.session.authenticated) {
      console.log("Ocultando: " + req.param('id'));
    }*/
    res.redirect('/usuario/perfil/' + req.session.User.id)
  },
  ocultar: function (req, res) {
    console.log("Desocultando: " + req.param('id'));
    /*if (req.session.authenticated) {
      console.log("Ocultando: " + req.param('id'));
    }*/
    res.redirect('/usuario/perfil/' + req.session.User.id)
  },
  eliminar: function (req, res) {
    console.log("Eliminando: " + req.param('id'));
    /*if (req.session.authenticated) {
      console.log("Ocultando: " + req.param('id'));
    }*/
    res.redirect('/usuario/perfil/' + req.session.User.id)
  },
  index: function(req, res) { //Pagina principal de todas las entradas
    Entrada.find({
      limit: 30,
      sort: 'updatedAt DESC',
      eliminado: [false, undefined],
      oculto: [false, undefined]
    }).populateAll().exec(function(e, r) {
      //console.log(r[0].toJSON())
      //res.json(r);
      if (e) {
        console.log(JSON.stringify(e));
        return next(e);
      }
      for (var i = 0; i < r.length; i++) {
        r[i].createdAt = moment(r[i].createdAt).fromNow();
        r[i].updatedAt = moment(r[i].updatedAt).fromNow();
      }
      //console.log("R: " + JSON.stringify(r));
      res.view({
        autenticado: (req.session.authenticated && req.session.authenticated != undefined) ? true : false,
        id_usuario: req.session.User != undefined ? req.session.User.id : undefined,
        entradas: r
      });
    });
  },
  search: function(req, res) {
    var search = req.param('search');
    console.log("Buscando entradas con: " + search);
    if (search != undefined) {
      Entrada.find({
        titulo: {
          'like': '%' + search
        },
        sort: 'updatedAt DESC'
      }).populateAll().exec(function(e, r) {
        //console.log(r[0].toJSON())
        //res.json(r);
        //console.log("Resultados de busqueda: \n" + JSON.stringify(r));
        if (e) {
          console.log(JSON.stringify(e));
          return next(e);
        }
        for (var i = 0; i < r.length; i++) {
          r[i].createdAt = moment(r[i].createdAt).fromNow();
          r[i].updatedAt = moment(r[i].updatedAt).fromNow();
        }
        //console.log("R: " + JSON.stringify(r));
        res.view('entrada/index', {
          entradas: r
        });
      });
    }
  },
  /* Crear Entrada */
  create: function(req, res, next) {
    //console.log("Peticion: " + JSON.stringify(req.params));
    console.log("ID del usuario que publica: " + req.session.User.id);
    var entrada = {
      titulo: req.param('titulo'),
      cuerpo: req.param('cuerpo'),
      fondo: req.param('fondo'),
      resumen: req.param('resumen'),
      categoria_entrada_ref: req.param('categoria_entrada_ref'),
      entrada_usuario: req.session.User.id
    }
    if (entrada.titulo != undefined && entrada.cuerpo != undefined && entrada.fondo != undefined) {
      //console.log("Peticion & entrada> " + JSON.stringify(entrada));
      Entrada.create(entrada, function(err, value) {
        if (err) {
          console.log("Error al crear una entrada, error: " + err);
          //return res.redirect('comentario/nuevo');
          return next(err);
        }
        return res.json(value);
      });
    } else {
      console.log("Error al crear una entrada, Faltan campos. ");
      return next(err);
    }
  },
  showOne: function(req, res) {
    Entrada.findOneById(req.param('id')).populateAll().exec(function(err, value) {
      if (err) {
        req.session.flash = {
          err: err
        };
        console.log("Error al buscar una entrada.");
        return res.redirect('/entrada');
      }
      if (value != undefined) {
        value.createdAt = moment(value.createdAt).fromNow();
        value.updatedAt = moment(value.updatedAt).fromNow();

        res.locals.layout = 'layouts/public';
        res.view({
          entrada: value
        });
      } else {
        console.log("No se encontro la entrada.");
        return res.redirect('/entrada');
      }
    });
  },
  editar: function(req, res, next) {
    console.log("Editando la entrada: " + req.param('id'));
    Entrada.findOneById(req.param('id')).populateAll().exec(function(err, value) {
      if (err) {
        req.session.flash = {
          err: err
        };
        console.log("Error al buscar una entrada.");
        return res.redirect('/entrada');
      }
      if (value != undefined) {
        value.createdAt = moment(value.createdAt).fromNow();
        value.updatedAt = moment(value.updatedAt).fromNow();

        CategoriaEntrada.find(function CategoriaEntradaFounded(err, values) {
          if (err) {
            console.log('Error al consultar las categorias de las entradas. ' + err);
            return next(err);
          }
          console.log("Se han consultado " + (values.length) + " categorias de entrada, form editar");

          res.view('entrada/nuevo', {
            categorias: values,
            direccion: 'update',
            entrada: value
          });
        });
      } else {
        console.log("No se encontro la entrada.");
        return res.redirect('/entrada');
      }
    });
  },
  todas: function(req, res) {
    Entrada.find({}).populateAll().exec(function(e, r) {
      //console.log(r[0].toJSON())
      res.json(r);
    });
  }
};
