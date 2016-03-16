angular.module('Blog', [])

.controller('ControllerPage', ['$scope', function($scope) {
  $scope.entradas_menu = [{
    nombre_blog: 'Blogla',
    nombre: "Nuevo usuario",
    enlace: '#/usuario/nuevo'
  }];
}]);
