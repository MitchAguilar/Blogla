/**
 * CategoriaEntradaController
 *
 * @description :: Server-side logic for managing Categoriaentradas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
moment.locale('es');

module.exports = {

	index: function(req, res) {
		CategoriaEntrada.find(function CategoriaEntradaFounded(err, values) {
			if (err) {
				console.log('Error al consultar las categorias de las entradas. ' + err);
				return next(err);
			}
			res.json({
				categoriasentradas: values,
				direccion: 'create'
			});
		});
	}
};
