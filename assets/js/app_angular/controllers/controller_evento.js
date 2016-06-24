app.controller('ControllerEvento', [
	'$scope',
	'$http',
	function($scope, $http) {
		$scope.moment = moment;
		$scope.moment.locale('es');

		$scope.getEventos = function() {
			$http.get('/evento').success(function(data, status, headers, config) {
				//console.log(JSON.stringify($scope.categoriasentradas));
				$scope.eventos = data;
			}).error(function(data, status, headers, config) {
				console.log("Error> " + data);
			});
		};

		$scope.addEvento = function() {
			if ($scope.nombre_categoria != undefined && $scope.descripcion != undefined) {
				$http.post('/evento/create?_csrf=' + $scope._csrf +
						'&nombre_categoria=' + $scope.nombre_categoria +
						'&descripcion=' + $scope.descripcion)
					.success(function(data, status, headers, config) {
						$scope.getCategoriaentradas();
						console.log(JSON.stringify(data));
					}).error(function(data, status, headers, config) {
						alert(JSON.stringify(data));
						console.log("Error: " + data);
					});
			}
		};
	}
]);
