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
	ocultar: function(req, res) {
		console.log("Ocultando: " + req.param('id'));
		if (!req.param('id')) {
			res.status(400);
			res.view('400', {
				message: 'Error al ocultar entrada, error 222, no se ha especificado el idenficador de la entrada. Contacte al administrador del blog!'
			});
		} else {
			var _id = req.param('id');
			console.log("El id a actualizar: " + _id);

			var update_ent = {
				oculto: true
			}

			updateEntrada(_id, update_ent, function(err, updated) {
				if (err) {
					res.status(400);
					return res.view('400', {
						message: 'Error al actualizar entrada, error 4454, error de parametros, contacte al administrador del blog!'
					});
				}
				console.log('Ocultada entrada con id ' + updated[0].id);

				findEntrada(updated[0].id, function(err, value) {
					return res.json({
						entrada: value
					});
				})
			});
		}
	},
	desocultar: function(req, res) {
		console.log("desOcultando: " + req.param('id'));
		if (!req.param('id')) {
			res.status(400);
			res.view('400', {
				message: 'Error al ocultar entrada, error 222, no se ha especificado el idenficador de la entrada. Contacte al administrador del blog!'
			});
		} else {
			var _id = req.param('id');
			console.log("El id a desocultar: " + _id);

			var update_ent = {
				oculto: false,
			}

			updateEntrada(_id, update_ent, function(err, updated) {
				if (err) {
					res.status(400);
					return res.view('400', {
						message: 'Error al actualizar entrada, error 4454, error de parametros, contacte al administrador del blog!'
					});
				}
				console.log('Ocultada entrada con id ' + updated[0].id);

				findEntrada(updated[0].id, function(err, value) {
					return res.json({
						entrada: value,
						estado: true
					});
				})
			});
		}
	},
	eliminar: function(req, res) {
		console.log("Eliminando: " + req.param('id'));
		console.log("Eliminando entrada");
		if (!req.param('id')) {
			res.status(400);
			res.view('400', {
				message: 'Error al ocultar entrada, error 222, no se ha especificado el idenficador de la entrada. Contacte al administrador del blog!'
			});
		} else {
			var _id = req.param('id');
			console.log("El id a eliminar: " + _id);

			var update_ent = {
				eliminado: true,
			}

			updateEntrada(_id, update_ent, function(err, updated) {
				if (err) {
					res.status(400);
					return res.view('400', {
						message: 'Error al eliminar entrada, error 4454, error de parametros, contacte al administrador del blog!'
					});
				}
				console.log('Ocultada entrada con id ' + updated[0].id);

				findEntrada(updated[0].id, function(err, value) {
					return res.json({
						entrada: value,
						estado: true
					});
				})
			});
		}
	},
	index: function(req, res) { //Pagina principal de todas las entradas
		listEntradas(req, false, false, function(value) { //Mostrar al usuario los no ocultos y eliminados
			return res.view(value);
		});
	},
	search: function(req, res) {
		var search = req.param('search');
		if (search != undefined) {
			console.log("Buscando entradas con: " + search);
			Entrada.find({
				titulo: {
					'like': '%' + search + '%'
				},
				sort: 'updatedAt DESC'
			}).populateAll().exec(function(e, r) {
				//console.log(r[0].toJSON())
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
					autenticado: (req.session.authenticated && req.session.authenticated != undefined) ? true : false,
					entradas: r
				});
			});
		}
	},
	create: function(req, res, next) { /* Crear Entrada en la base de datos */
		//console.log("Peticion: " + JSON.stringify(req.params));
		req.file('fondo').upload({
			// You can apply a file upload limit (in bytes)
			maxBytes: 2000000,
			dirname: '../../assets/images/imageFolder'
				//adapter: require('skipper-disk')
		}, function whenDone(err, uploadedFiles) {
			if (err) {
				var error = {
					"status": 500,
					"error": err
				};
				res.status(500);
				return res.json(error);
			} else {
				for (u in uploadedFiles) {
					//"fd" contains the actual file path (and name) of your file on disk
					fileOnDisk = uploadedFiles[u].fd;

					// I suggest you stringify the object to see what it contains and might be useful to you
					console.log(JSON.stringify(uploadedFiles[u]));
					var pos = fileOnDisk.indexOf("/images/imageFolder/");
					var ruta_foto = fileOnDisk.substring(pos, fileOnDisk.length);
					console.log("Ruta_ " + ruta_foto);

					console.log("ID del usuario que publica: " + req.session.User.id);
					var entrada = {
						titulo: req.param('titulo'),
						cuerpo: req.param('cuerpo'),
						fondo: ruta_foto,
						resumen: req.param('resumen'),
						oculto: false,
						eliminado: false,
						categoria_entrada_ref: req.param('categoria_entrada_ref'),
						entrada_usuario: req.session.User.id
					}

					if (entrada.titulo != undefined && entrada.cuerpo != undefined && entrada.fondo != undefined) {
						Entrada.create(entrada, function(err, value) {
							if (err) {
								console.log("Error al crear una entrada, error: " + err);
								//return res.redirect('comentario/nuevo');
								return next(err);
							}
							return res.redirect('entrada/showOne/' + value.id);
						});
					} else {
						console.log("Error al crear una entrada, Faltan campos. ");
						return next(err);
					}
				}
			}
		});
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
				value.createdAt = momentParse(value.createdAt);
				value.updatedAt = momentParse(value.updatedAt);

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
	editar: function(req, res, next) { /* Abre el formulario de edicion de entrada */
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
				value.createdAt = momentParse(value.createdAt);
				value.updatedAt = momentParse(value.updatedAt);

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
	update: function(req, res, next) { /* Recibe peticion PUT de editar una entrada */
		console.log("Actualizando entrada");
		if (!req.param('id')) {
			res.status(400);
			res.view('400', {
				message: 'Error al actualizar entrada, error 333, contacte al administrador del blog!'
			});
		} else {
			var _id = req.param('id');
			console.log("El id a actualizar: " + _id);

			var update_ent = {
				titulo: req.param('titulo'),
				cuerpo: req.param('cuerpo'),
				fondo: req.param('fondo'),
				resumen: req.param('resumen'),
				oculto: false,
				eliminado: false,
				categoria_entrada_ref: req.param('categoria_entrada_ref'),
				entrada_usuario: req.session.User.id
			}

			updateEntrada(_id, update_ent, function(err, updated) {
				if (err) {
					res.status(400);
					return res.view('400', {
						message: 'Error al actualizar entrada, error 4454, error de parametros, contacte al administrador del blog!'
					});
				}
				console.log('Updated entrada con id ' + updated[0].id);

				findEntrada(updated[0].id, function(err, value) {
					return res.view('entrada/showOne', {
						entrada: value
					});
				})
			});
		}
	},
	json: function(req, res) { //Traer todas las publicaciones hasta las Ocultas
		listEntradas2(req, false, function(value) {
			return res.json(value)
		});
	}
};

/**
 * Convertir fecha a rango de tiempo, --> p.e.: hace 2 horas...
 */
var momentParse = function(string) {
	return moment(string).fromNow();
}

/**
 * Busca una entrada por id
 * @param  {[type]}   _id      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var findEntrada = function(_id, callback) {
	Entrada.findOneById(_id).populateAll().exec(function(err, value) {
		value.createdAt = momentParse(value.createdAt);
		value.updatedAt = momentParse(value.updatedAt);
		callback(err, value);
	});
}

/**
 * Actualiza una entrada
 */
var updateEntrada = function(_id, atributos, callback) {
	Entrada.update({
		id: _id
	}, atributos).exec(function afterwards(err, updated) {
		console.log('Updated entrada con id ' + updated[0].id);
		callback(err, updated);
	});
}

/**
 * Listar entradas en formato json
 * Si eliminado == true, trae los eliminados
 * Si oculto == true, trae los ocultos
 */
var listEntradas = function(req, eliminado, oculto, callback) {
	Entrada.find({
		limit: 30,
		sort: 'updatedAt DESC',
		eliminado: [eliminado, undefined], // Consultar solamente los no eliminados
		oculto: [oculto, undefined] // Consultar solamente los no ocultos
	}).populateAll().exec(function(e, r) {
		//console.log(r[0].toJSON())
		//res.json(r);
		if (e) {
			console.log(JSON.stringify(e));
			return next(e);
		}
		for (var i = 0; i < r.length; i++) {
			r[i].datetimeCreateAt = r[i].createdAt;
			r[i].createdAt = moment(r[i].createdAt).fromNow();
			r[i].updatedAt = moment(r[i].updatedAt).fromNow();
		}
		//console.log("R: " + JSON.stringify(r));
		var value = {
			autenticado: ((req.session.authenticated && req.session.authenticated != undefined) ? true : false),
			id_usuario: req.session.User != undefined ? req.session.User.id : undefined,
			entradas: r
		};
		callback(value);
	});
}

/**
 * Listar entradas en formato json
 * Si eliminado == true, trae los eliminados
 * Si oculto == true, trae los ocultos
 */
var listEntradas2 = function(req, eliminado, callback) {
	Entrada.find({
		limit: 30,
		sort: 'updatedAt DESC',
		eliminado: [eliminado, undefined] // Consultar solamente los no eliminados
	}).populateAll().exec(function(e, r) {
		//console.log(r[0].toJSON())
		//res.json(r);
		if (e) {
			console.log(JSON.stringify(e));
			return next(e);
		}
		//console.log("R: " + JSON.stringify(r));
		var value = {
			autenticado: ((req.session.authenticated && req.session.authenticated != undefined) ? true : false),
			id_usuario: req.session.User != undefined ? req.session.User.id : undefined,
			entradas: r
		};
		callback(value);
	});
}
