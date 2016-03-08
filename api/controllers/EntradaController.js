/**
 * EntradaController
 *
 * @description :: Server-side logic for managing entradas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
moment.locale('es');


module.exports = {
  nuevo: function(req, res) {
    res.view();
  },
  index: function(req, res) {
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
};
