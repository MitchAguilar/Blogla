/**
 * ComentarioController
 *
 * @description :: Server-side logic for managing comentarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req, res){
		console.log("Formulario de nuevo comentario");
		res.view('/comentario/nuevo');
	},
	create: function (req, res) {
		var ComentarioObj = {
			cuerpo: req.param('cuerpo')
		}

		Comentario.create(ComentarioObj, function (err, value) {
			if(err){
				return res.redirect('comentario/nuevo');
			}
			return res.redirect('comentario');
		});
	}
};
