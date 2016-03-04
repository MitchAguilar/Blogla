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
    contrasenia: {
      type: 'string',
      required: true
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
    }
  }
};
