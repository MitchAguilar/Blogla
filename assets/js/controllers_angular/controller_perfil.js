var app = angular.module('Blog', []);

app.controller('ControllerPerfil', [
  '$scope',
  '$http',
  function($scope, $http) {
    $scope.moment = moment;
    $scope.moment.locale('es');

    $http.get('/categoriaentrada').then(function(response) {
      self.categoriasentradas = response.data;
      console.log(self.categoriasentradas);
    });

    /**
     * Get JSON entradas
     * @return {[type]} [description]
     */
    $scope.getEntradas = function() {
      $http.get('/entrada/json').success(function(data, status, headers, config) {
        $scope.entradas_ocultas = 0;
        $scope.entradas = data;
        $scope.entradas.entradas.forEach(item => {
          if (item.oculto == true) {
            $scope.entradas_ocultas++;
          }
        });
      }).error(function(data, status, headers, config) {
        console.log("Error> " + data);
      });
    };

    $scope.ocultarEntrada = function(idEntrada) {
      $http.get('/entrada/ocultar/'+idEntrada).success(function(data, status, headers, config) {
        console.log(JSON.stringify("Ocultando>  " + data));
        $scope.getEntradas();
      }).error(function(data, status, headers, config) {
        console.log("Error> " + data);
      });
    };

    $scope.desocultarEntrada = function(idEntrada) {
      $http.get('/entrada/desocultar/'+idEntrada).success(function(data, status, headers, config) {
        console.log(JSON.stringify("Desocultando>  " + data));
        $scope.getEntradas();
      }).error(function(data, status, headers, config) {
        console.log("Error> " + data);
      });
    };

    $scope.eliminarEntrada = function(idEntrada) {
      $http.get('/entrada/eliminar/'+idEntrada).success(function(data, status, headers, config) {
        console.log(JSON.stringify("Eliminando>  " + data));
        $scope.getEntradas();
      }).error(function(data, status, headers, config) {
        console.log("Error> " + data);
      });
    };

    $scope.fnclick_dashboard = function() {
      $scope.click_dashboard = true;
      $scope.publicar = false;
      $scope.registrar_usuario = false;
    };

    $scope.click_categoria_entrada = function() {
      $scope.click_dashboard = false;
      $scope.publicar = true;
      $scope.registrar_usuario = false;
    };

    $scope.click_publicar = function() {
      $scope.click_dashboard = false;
      $scope.publicar = true;
      $scope.registrar_usuario = false;
    };

    $scope.click_new_usuario = function() {
      $scope.click_dashboard = false;
      $scope.publicar = false;
      $scope.registrar_usuario = true;
    };

    $scope.inicializar = function() {
      $scope.entradas = [];
      $scope.entradas_ocultas = 0;

      $scope.getEntradas();

      $scope.fnclick_dashboard();
    };
  }
]);
