module.exports = function(req, res, ok) {
  if (req.session.authenticated) {
    res.locals.flash = {};
    if (!req.session.flash) {
      return ok();
    }
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
    return ok();
  }

  var requireLoginError = [{
    message: 'Debes iniciar sesion'
  }];

  req.session.flash = {
    err: requireLoginError
  };

  console.log("authenticated::> Redirigiendo a signin porque no se tienen permisos para acceder.");
  return res.redirect('/');
}
