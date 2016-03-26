var app = angular.module('Blog', []);
var dir = 'http://localhost:1337';

app.controller('ControllerHomePage', ['$scope', function($scope) {
  $scope.entradas_menu = [{
    nombre: "Nuevo usuario",
    enlace: '#/usuario/nuevo'
  }];
}]);

app.controller('CtrlPerfil', ['$scope', function($scope, $http) {
  $scope.suma = (2 + 2);
  $scope.entradas = [];
/*  $http({
    method: 'GET',
    url: dir + '/entrada'
  }).success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).error(function(data, status, headers, config) {
    $scope.name = 'Error!';
  });*/
}]);
