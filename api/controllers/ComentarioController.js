/**
 * ComentarioController
 *
 * @description :: Server-side logic for managing comentarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
moment.locale('es');

module.exports = {
  nuevo: function(req, res) {
    console.log("Formulario de nuevo comentario");
    res.view(); //Sails reconoce a que vista debe ir, en este caso el busca nuevo.ejs
  },
  create: function(req, res) {
    var ComentarioObj = {
      cuerpo: req.param('cuerpo')
    }

    Comentario.create(ComentarioObj, function(err, value) {
      if (err) {
        return res.redirect('comentario/nuevo');
      }
      return res.redirect('comentario');
    });
  },
  show: function(req, res, next) {
    Comentario.findOne(req.param('id'), function comentarioFounded(err, value) {
      if (err) {
        return next(err);
      }
      res.view({
        comentario: value
      });
    });
  },
  edit: function(req, res, next) {
    Comentario.findOne(req.param('id'), function comentarioFounded(err, value) {
      if (err) {
        return next(err);
      }
      res.view({
        comentario: value
      });
    });
  },
  update: function(req, res) {
    var ComentarioObj = {
      cuerpo: req.param('cuerpo')
    }

    Comentario.update(req.param('id'), ComentarioObj, function comentarioUpdate(err, value) {
      if (err) {
        req.session.flash = {
          err: err
        }
        res.redirect('comentario/edit/' + req.param('id'));
      }
      res.redirect('comentario/show/' + req.param('id'));
    });
  },
  index: function(req, res, next) {
    Comentario.find(function comentarioFounded(err, values) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < values.length; i++) {
        values[i].createdAt = moment(values[i].createdAt).fromNow();
        values[i].updatedAt = moment(values[i].updatedAt).fromNow();
      }
      res.view({
        comentarios: values
      });
    });
  }
};
