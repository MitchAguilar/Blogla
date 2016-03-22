var app = angular.module('Blog', []);

app.controller('ControllerHomePage', ['$scope', function($scope) {
  $scope.entradas_menu = [{
    nombre: "Nuevo usuario",
    enlace: '#/usuario/nuevo'
  }];
}]);

app.controller('ControllerHomePage', ['$scope', function($scope) {
  $scope.entradas_menu = [{
    nombre: "Nuevo usuario",
    enlace: '#/usuario/nuevo'
  }];
}]);
