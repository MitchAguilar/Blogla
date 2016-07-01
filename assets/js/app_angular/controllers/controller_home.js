app.controller('ControllerHomePage', [
	'$scope',
	'$http',
	function($scope, $http) {
		$scope.moment = moment;
		$scope.moment.locale('es');

		/**
		 * *************************************************************************
		 * 																Entradas
		 * *************************************************************************
		 */

		$scope.publicaciones = [{}];

		/**
		 * Get JSON entradas
		 */
		$scope.getEntradas = function() {
			$http.get('/entrada/index').success(function(data, status, headers, config) {
				$scope.publicaciones = data;
				//console.log(JSON.stringify($scope.publicaciones));
			}).error(function(data, status, headers, config) {
				console.log("Error> " + data);
			});
		};

		$scope.getEntradas();

		/**
		 * [function description]
		 * @return {[type]} [description]
		 */
		$scope.buscar = function() {
			//console.log($scope.buscar_frase);
			if ($scope.buscar_frase.trim().length > 0) {
				$http.get('/entrada/search?search=' + $scope.buscar_frase).success(function(data, status, headers, config) {
					//console.log(JSON.stringify(data));
					$scope.resultados_publicaciones = data;
				}).error(function(data, status, headers, config) {
					console.log("Error> " + data);
				});
			} else {
				$scope.resultados_publicaciones = [];
			}
		};

		/**
		 * [function buscar todas las entradas segun una categoria]
		 * @return {[type]} [description]
		 */
		$scope.xcategoria = function(idCategoria) {
			//console.log(idCategoria);
			if (idCategoria.trim().length > 0) {
				$http.get('/entrada/entradasxcategoria?idCategoria=' + idCategoria).success(function(data, status, headers, config) {
					//console.log(JSON.stringify(data));
					$scope.publicaciones = data;
				}).error(function(data, status, headers, config) {
					console.log("Error> " + data);
				});
			} else {
				$scope.publicaciones = [];
			}
		};
	}
]);
