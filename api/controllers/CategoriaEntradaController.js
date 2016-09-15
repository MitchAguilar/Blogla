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
		CategoriaEntrada.find({
			sort: 'updatedAt DESC',
			eliminado: [false, undefined] // Consultar los No eliminados
		}).populateAll().exec(function(err, r) {
			if (err) {
				console.log('Error al consultar las categorias de las entradas. ' + err);
				return next(err);
			}
			res.json({
				categoriasentradas: r,
				direccion: 'create'
			});
		});
	},
	eliminar: function(req, res) {
		var _id = req.param('id');
		var toUpdate = {
			eliminado: true
		};

		CategoriaEntrada.update({
			id: _id
		}, toUpdate).exec(function afterwards(err, updated) {
			console.log('Updated entrada con id ' + updated[0].id);
			return res.json({
				id: updated[0].id
			});
		});
	},
	create: function(req, res) {
		var categoriaentrada = {
			nombre_categoria: req.param('nombre_categoria'),
			descripcion: req.param('descripcion')
		};

		if (categoriaentrada.nombre_categoria != undefined && categoriaentrada.descripcion != undefined) {
			CategoriaEntrada.create(categoriaentrada, function(err, value) {
				if (err) {
					console.log("Error al crear una categoriaentrada, error: " + err);
					return next(err);
				}
				return res.send(value);
			});
		} else {
			console.log("Error al crear una categoriaentrada, Faltan campos. ");
			var err = {
				message: "Faltan campos para registrar la categoriaentrada"
			};
			return next(err);
		}
	}
};
