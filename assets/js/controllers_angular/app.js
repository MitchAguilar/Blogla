var app = angular.module('Blog', []);
var dir = 'http://localhost:1337';

app.controller('ControllerHomePage', ['$scope', function($scope) {
	$scope.entradas_menu = [{
		nombre: "Nuevo usuario",
		enlace: '#/usuario/nuevo'
	}];
}]);

app.controller('ControllerIndexEntradas', ['$scope', function($scope, $http) {
	$scope.suma = (2 + 2);
	$scope.entradas = [];

	$scope.inicializar = function() {
		$http({
			method: 'GET',
			url: dir + '/entrada/json'
		}).success(function(data, status, headers, config) {
			$scope.name = data.name;
			console.log(status);
		}).error(function(data, status, headers, config) {
			$scope.name = 'Error!';
		});
	}
}]);
