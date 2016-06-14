/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    /***************************
            Datos personales
     */
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
    /*************************
            Seguridad
    */
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
    /************************
          Multimedia
    */
    portada: {
      type: 'string'
    },
    foto: {
      type: 'json'
    },
    /************************
          Redes sociales
    */
    social: {
      type: 'json'
    },
    /************************
            Relaciones
    */
    rol: { /* Relacion con usuario */
      model: 'Rol',
      via: 'usuario'
    },
    entrada: { /* Relacion con Entrada */
      model: 'Entrada',
      via: 'entrada_usuario'
    },
    /************************
        Retorno de Datos
    */
    toJSON: function() {
      var obj = this.toObject();
      delete obj.contrasenia;
      delete obj.contrasenia_confirmacion;
      delete obj.contrasenia_encriptada;
      delete obj._csrf;
      return obj;
    }
  },
  /***************************
        "Triggers"
  */
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
