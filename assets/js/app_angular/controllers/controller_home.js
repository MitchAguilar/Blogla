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
				$scope.threadReloadTime();
			}).error(function(data, status, headers, config) {
				console.log("Error> " + data);
			});
		};

		$scope.getEntradas();

		/**
		 * [setInterval actualizar entradas cada 5 minutos]
		 * @param {[type]} function ( [description]
		 */
		setInterval(function() {
			$scope.getEntradas();
		}, 50000);

		/**
		 * [setInterval Actualizar las fechas con momentjs]
		 *  @param {[type]} function ( [description]
		 */
		$scope.threadReloadTime = function() {
			if ($scope.publicaciones) {
				if ($scope.publicaciones.entradas.length > 0) {
					for (var i = 0; i < $scope.publicaciones.entradas.length; i++) {
						$scope.publicaciones.entradas[i].createdAt = moment($scope.publicaciones.entradas[i].createdAt).fromNow();
						$scope.publicaciones.entradas[i].updatedAt = moment($scope.publicaciones.entradas[i].updatedAt).fromNow();
						console.log($scope.publicaciones.entradas[i].updatedAt);
					}
				}
			}
		};


		/**
		 * [function description]
		 * @return {[type]} [description]
		 */
		$scope.buscar = function() {
			console.log($scope.buscar_frase);
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
	}
]);
