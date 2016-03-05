angular.module('myApp', [])

.controller('ControllerHomePage', ['$scope', function($scope) {
  $scope.entradas_menu = [{
    nombre: "Nuevo usuario",
    enlace: '#/usuario/nuevo'
  }];
}]);
