/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
var nodemailer = require('nodemailer');
moment.locale('es');

module.exports = {

	login: function(req, res) { /* Iniciar sesion, se verifican que las credenciales coincidan con el usuario registrado */
		var email = req.param('email');
		var contrasenia = req.param('contrasenia');
		if (!email || !contrasenia) {
			var credencialError = {
				message: 'Debe ingresar un usuario y una contraseña'
			};
			req.session.flash = {
				err: credencialError
			};
			return res.redirect('/usuario/signin');
		} else {
			//if (is.email(email)) { //Validar email
			Usuario.findOneByEmail(email, function UsuarioFounded(err, value) {
				if (err) {
					req.session.flash = {
						err: err
					};
					return res.redirect('/usuario/signin');
				}
				if (!value) {
					var noUserFounded = [{
						message: 'El usuario "' + email + '" no existe.'
					}];
					req.session.flash = {
						err: noUserFounded
					};
					return res.redirect('/usuario/signin');
				}
				require('bcrypt').compare(contrasenia, value.contrasenia_encriptada, function passwordMatch(err, valid) {
					if (err) {
						req.session.flash = {
							err: err
						};
						return res.redirect('/usuario/signin');
					}
					if (!valid) {
						var contraseniaNoDontMatchError = [{
							message: 'Contraseña incorrecta!'
						}];
						req.session.flash = {
							err: contraseniaNoDontMatchError
						};
						return res.redirect('/usuario/signin');
					}
					req.session.authenticated = true;
					req.session.User = value;

					console.log("Usuario inicio sesion, id: " + JSON.stringify(req.session.User.id));
					return res.redirect('/usuario/perfil/' + value.id);
				});
			});
			/*  } else {
			    console.log("Intento de acceso con email incorrecto: " + email);
			  }*/
		}
	},
	signin: function(req, res) { /* Abre el formulario de iniciar sesion o login */
		if (req.session.User == undefined) { //Si NO se ha iniciado sesion entonces se dirige a signin
			res.view();
		} else {
			//El Usuario se encuentra Logeado, se dirige al menu del Perfil
			console.log("Intento de entrar a login pero el Usuario " + req.session.User.id + " está Logeado, redigiendo al menu Perfil ");
			console.log("EL ID: " + req.session.User.id);
			res.redirect('/usuario/perfil/' + req.session.User.id);
		}
	},
	register: function(req, res) { /* Abre el formulario de registrar usuario */
		res.view();
	},
	create: function(req, res) { /* Crear */
		var email = req.param('email');
		var contrasenia = req.param('contrasenia');
		if (!email || !contrasenia) {
			var credencialError = {
				message: 'Debe ingresar un usuario y una contraseña'
			};
			req.session.flash = {
				err: credencialError
			};
			return res.redirect('/usuario/register');
		} else {
			/* Buscar rol de editor para asignarlo al nuevo usuario a registrar */
			Rol.findOne({
				nombre: ['Editor', 'editor', 'edit']
			}, function RolFounded(err, value) {
				if (err) {
					console.log(JSON.stringify(err));
					req.session.flash = {
						err: err
					};
					return res.redirect('/usuario/register');
				} else if (value.id == undefined) {
					req.session.flash = {
						err: {
							message: 'No se puede registrar debido a que NO existen roles.'
						}
					};
					return res.redirect('/usuario/register');
				} else {
					console.log("Roles encontrados: " + (value.length));

					var UserObj = {
						email: req.param('email'),
						nombres: req.param('nombres'),
						apellidos: req.param('apellidos'),
						nick: req.param('nick'),
						foto: req.param('foto'),
						portada: req.param('portada'),
						fecha_nacimiento: req.param('fecha_nacimiento'),
						biografia: req.param('biografia'),
						contrasenia: req.param('contrasenia'),
						contrasenia_confirmacion: req.param('contrasenia_confirmacion'),
						rol: value.id //Se asigna el id del rol perteneciente a editor
					};

					Usuario.create(UserObj, function(err, value) {
						if (err) {
							console.log(JSON.stringify(err));
							req.session.flash = {
								err: err
							};
							return res.redirect('/usuario/register');
						}
						/* Se autentica el request para darle acceso al
						 usuario a las Politicas -> Authenticated */
						req.session.authenticated = true;
						req.session.User = value;

						return res.redirect('/usuario/perfil/' + value.id); //Refidigir a la pagina del perfil despues de un registro exitoso
					});
				}
			});
		}
	},
	perfil: function(req, res) { /* Abre el perfil del usuario */
		Usuario.findOne(req.param('id'), function usuarioFounded(err, value_user) {
			if (err) {
				console.log(JSON.stringify(err));
				req.session.flash = {
					err: err
				};
				return res.redirect('/usuario/register');
			}
			if (value_user != undefined) {
				//Buscar entradas publicadas por un usuario, muestra todas excepto las eliminadas
				Entrada.find({
					entrada_usuario: value_user.id,
					sort: 'createdAt DESC',
					eliminado: [false, undefined]
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
					//console.log(r.length + " Entradas relacionadas al usuario " + value_user.id + ": \n" + JSON.stringify(r));
					res.locals.layout = 'layouts/internal';

					CategoriaEntrada.find({ //Consulta categorias de entradas para la seccion de publicar
						sort: 'createdAt DESC'
					}).populateAll().exec(function(error, categoriasent) {
						res.view({
							entradas: r,
							usuario: value_user,
							categorias: categoriasent,
							direccion: 'create'
						});
					});
				});
			} else {
				return res.redirect('/'); // Si se inserta un id de usuario incorrecto, se redirige al index
			}
		});
	},
	signout: function(req, res) { /* Cerrar la sesion */
		console.log("Usuario cerrando session: " + req.session.User.id);
		req.session.authenticated = false;
		req.session.User = undefined;
		//    res.redirect('/usuario/signin'); //Refidigir a iniciar sesion
		res.redirect('/entrada'); //Refidigir a la pagina principal
	},
	index: function(req, res) {
		console.log("Mostrando todos los usuarios.");
		Usuario.find({}).populateAll().exec(function(e, r) {
			//console.log(r[0].toJSON())
			res.json(r);
		});
	},
	rclave: function(req, res) {
		if (req.session.User == undefined) { //Si NO se ha iniciado sesion entonces se dirige a rclave
			res.view();
		} else {
			//El Usuario se encuentra Logeado, se dirige al menu del Perfil
			console.log("Intento de entrar a rclave pero el Usuario " + req.session.User.id + " está Logeado, redigiendo al menu Perfil ");
			res.redirect('/usuario/perfil/' + req.session.User.id);
		}
	},
	recuperarclave: function(req, res) {
		var email = req.param('email');
		if (/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
			Usuario.findOneByEmail(email, function UsuarioFounded(err, value) {
				if (err) {
					req.session.flash = {
						err: err
					};
					return res.redirect('/usuario/rclave');
				}
				if (!value) { //Validar si el correo se encontró
					var noUserFounded = [{
						message: 'El correo "' + email + '" no existe.'
					}];
					req.session.flash = {
						err: noUserFounded
					};
					return res.redirect('/usuario/rclave');
				} else {
					//Success Validation
					var smtpTransport = nodemailer.createTransport("SMTP", {
						service: "Hotmail",
						auth: {
							user: "anlijudavid@hotmail.com",
							pass: "nullnull@@"
						}
					});

					var mailOptions = {
						from: "my site<foo@.com>", // sender address
						to: email, // list of receivers
						subject: "This is the subject", // Subject line
						html: "Este es un email enviado en node js" // html body
					}

					smtpTransport.sendMail(mailOptions, function(error, response) {
						if (error) {
							res.send("Ocurrio un error, intentalo mas tarde");
						} else {
							res.send("email enviado con exito")
						}
					});
				}
			});
		} else {
			var noUserFounded = [{
				message: 'El correo "' + email + '" es invalido.'
			}];
			req.session.flash = {
				err: noUserFounded
			};
			return res.redirect('/usuario/rclave');
		}
	}
}
