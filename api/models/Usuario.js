/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    nombres: {
      type: 'string',
      required: true
    },
    apellidos: {
      type: 'string'
    },
    nick: {
      type: 'string',
      required: true,
      unique: true,
      size: 20
    },
    fecha_nacimiento: {
      type: 'datetime'
    },
    contrasenia: {
      type: 'string',
      required: true
    },
    contrasenia_confirmacion: {
      type: 'string',
      required: true
    },
    contrasenia_encriptada: {
      type: 'string'
    },
    rol: { /* Relacion con usuario */
      model: 'Rol',
      via: 'usuario'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.contrasenia;
      delete obj.contrasenia_confirmacion;
      delete obj._csrf;
      return obj;
    }
  },
  beforeCreate: function(values, next) {
    console.log('Entro al beforeCreate de Usuario');
    var pass = values.contrasenia;
    var pass_conf = values.contrasenia_confirmacion;
    if (!pass || !pass_conf || pass != pass_conf) {
      var passwordDoesNotMatchError = [{
        name: 'passwordDoesNotMatchError',
        message: 'Las contraseñas deben coincidir'
      }];
      return next({
        err: passwordDoesNotMatchError
      });
    }
    require('bcrypt').hash(values.contrasenia, 10, function passwordEncrypted(err, encryptedPassword) {
      values.contrasenia_encriptada = encryptedPassword;
      next();
    });
  }
};
