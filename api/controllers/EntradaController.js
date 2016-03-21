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
        categorias: values
      });
    });
  },
  index: function(req, res) { //Pagina principal de todas las entradas
    Entrada.find(function EntradaFounded(err, values) {
      if (err) {
        console.log(JSON.stringify(err));
        return next(err);
      }
      for (var i = 0; i < values.length; i++) {
        values[i].createdAt = moment(values[i].createdAt).fromNow();
        values[i].updatedAt = moment(values[i].updatedAt).fromNow();
      }
      res.view({
        entradas: values
      });
    });
  },
  /* Crear Entrada */
  /* Inserta una nueva entrada,
  @param titulo
  @param cuerpo
  @param categoria_entrada
  */
  create: function(req, res, next) {
    console.log("Peticion: " + JSON.stringify(req.params));
    console.log("ID del usuario que publica: " + req.session.User.id);
    var entrada = {
      titulo: req.param('titulo'),
      cuerpo: req.param('cuerpo'),
      categoria_entrada_ref: req.param('categoria_entrada_ref'),
      usuario_publicador_ref: req.session.User.id
    }
    console.log("Peticion & entrada> " + JSON.stringify(entrada));

    Entrada.create(entrada, function(err, value) {
      if (err) {
        console.log("Error al crear una entrada, error: " + err);
        //return res.redirect('comentario/nuevo');
        return next(err);
      }
      return res.json(value);
    });

  }
};
