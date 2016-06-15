/**
 * Entrada.js
 *
 * Modelo de las publicaciones, post o entradas.
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
    fondo: {
      type: 'text'
    },
    resumen: {
      type: 'text',
      required: true
    },
    cuerpo: {
      type: 'text',
      required: true
    },
    eliminado: {
      type: 'boolean',
      default: false
    },
    oculto: {
      type: 'boolean',
      default: false
    },
    categoria_entrada_ref: {
      model: 'CategoriaEntrada',
      via: 'entrada_ref'
    },
    entrada_usuario: { /* Relacion con usuario */
      model: 'Usuario',
      via: 'usuario_publicador_ref'
    }
  }
};
