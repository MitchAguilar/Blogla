/**
 * HomePageController
 *
 * @description :: Server-side logic for managing Homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res, next) {
    console.log("Accediendo al index.");
    res.redirect('entrada');
  }
};
