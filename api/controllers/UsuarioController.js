/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* is.js */
/* Todo tipo de validaciones */
var is = require('is.js');

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
            message: 'El nombre de usuario no se encuentra'
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
    res.view();
  },
  register: function(req, res) { /* Abre el formulario de registrar usuario */
    res.view();
  },
  create: function(req, res) {
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
            fecha_nacimiento: req.param('fecha_nacimiento'),
            contrasenia: req.param('contrasenia'),
            contrasenia_confirmacion: req.param('contrasenia_confirmacion'),
            rol: value.id //Se asigna el id del rol perteneciente a editor
          }

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

            return res.redirect('/usuario/perfil/' + value.id); //Refidigir a la pagina del perfil
          });
        }
      });
    }
  },
  perfil: function(req, res) { /* Abre el perfil del usuario */
    Usuario.findOne(req.param('id'), function usuarioFounded(err, value) {
      if (err) {
        console.log(JSON.stringify(err));
        req.session.flash = {
          err: err
        };
        return res.redirect('/usuario/register');
      }
      if (value != undefined) {
        res.view({
          usuario: value
        });
      } else {
        return res.redirect('/'); // Si se inserta un id de usuario incorrecto, se redirige al index
      }
    });
  },
  signout: function(req, res) { /* Cerrar la sesion */
    req.session.destroy();
    req.redirect('/usuario/signin')
  },
  index: function(req, res) {
    console.log("Mostrando todos los usuarios.");
    Usuario.find({}).populateAll().exec(function(e, r) {
      //console.log(r[0].toJSON())
      res.json(r);
    });
  }
};
