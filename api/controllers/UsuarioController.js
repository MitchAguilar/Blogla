/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
      }
      return res.redirect('/usuario/signin');
    } else {
      Usuario.findOneByEmail(email, function UsuarioFounded(err, value) {
        if (err) {
          req.session.flash = {
            err: err
          }
          return res.redirect('/usuario/signin');
        }
        if (!value) {
          var noUserFounded = [{
            message: 'El nombre de usuario no se encuentra'
          }];
          req.session.flash = {
            err: noUserFounded
          }
          return res.redirect('/usuario/signin');
        }
        require('bcrypt').compare(contrasenia, value.contrasenia_encriptada, function passwordMatch(err, valid) {
          if (err) {
            req.session.flash = {
              err: err
            }
            return res.redirect('/usuario/signin');
          }
          if (!valid) {
            var contraseniaNoDontMatchError = [{
              message: 'Las contraseñas no coinciden'
            }];
            req.session.flash = {
              err: contraseniaNoDontMatchError
            }
            return res.redirect('/usuario/signin');
          }
          return res.redirect('/usuario/perfil/' + value.id);
        });
      });
    }
  },
  signin: function(req, res) {
    res.view();
  },
  register: function(req, res) {
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
      }
      return res.redirect('/usuario/register');
    } else {
      var UserObj = {
        email: req.param('email'),
        nombres: req.param('nombres'),
        apellidos: req.param('apellidos'),
        nick: req.param('nick'),
        fecha_nacimiento: req.param('fecha_nacimiento'),
        contrasenia: req.param('contrasenia'),
        contrasenia_confirmacion: req.param('contrasenia_confirmacion')
      };

      Usuario.create(UserObj, function(err, value) {
        if (err) {
          console.log(JSON.stringify(err));
          req.session.flash = {
            err: err
          };
          return res.redirect('/usuario/register');
        }
        return res.redirect('/usuario/show/' + value.id);
      });
    }
  }
};
