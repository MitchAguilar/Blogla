/**
* CategoriaEntrada.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    nombre_categoria: {
      type: 'string',
      required: true
    },
    descripcion: {
      type: 'string',
      required: false
    },
    eliminado: {
      type: 'boolean',
      default: false
    },
    entrada_ref: { // Referencia a entrada
      type: 'collection',
      via: 'categoria_entrada_ref'
    }
  }
};
