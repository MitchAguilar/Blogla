/**
* Evento.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    titulo: {
      type: 'string',
      required: true
    },
    oculto: {
      type: 'boolean',
      default: 'false'
    },
    fecha_inicio: {
      type: 'datetime',
      required: true
    },
    fecha_fin: {
      type: 'datetime',
      required: true
    },
    lugar: {
      type: 'string'
    }
  }
};
