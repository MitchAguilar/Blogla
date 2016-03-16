/**
 * EntradaController
 *
 * @description :: Server-side logic for managing entradas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
moment.locale('es');

module.exports = {
  nuevo: function(req, res) { //Abre el formulario de registrar Entrada
    console.log("Holaaaaaaaaaaaaaaaaaaaaaal");
    CategoriaEntrada.find(function CategoriaEntradaFounded(err, values) {
      if (err) {
        console.log('Error al consultar las categorias de las entradas. ' + err);
        return next(err);
      }
      console.log("CategoriaEntrada: -->" + JSON.stringify(values));
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
  }
  /*,
  create: function(req, res, next) {
    console.log("Peticion> " + JSON.stringify(req.params));
    var entrada = {
      titulo: req.param('titulo'),
      cuerpo: req.param('cuerpo'),
      categoria_entrada: req.param('categoria_entrada')
    }
    console.log("Peticion & entrada> " + JSON.stringify(entrada));

    Entrada.create(entrada, function(err, value) {
      if (err) {
        console.log("Error al crear una entrada, error: " + err);
        //return res.redirect('comentario/nuevo');
        return next(err);
      }
    });
  }*/
};
