var app = angular.module('Blog', []);

app.controller('ControllerPerfil', [
  '$scope',
  '$http',
  function($scope, $http) {
    $scope.moment = moment;
    $scope.moment.locale('es');

    $scope.getCategoriaentradas = function() {
      $http.get('/categoriaentrada').success(function(data, status, headers, config) {
        $scope.categoriasentradas = data.categoriasentradas;
        console.log(JSON.stringify($scope.categoriasentradas));
      }).error(function(data, status, headers, config) {
        console.log("Error> " + data);
      });
    };

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
        alert('No se pudo desocultar la entrada.\n' + status);
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


    /***************************************************************************
                                Funciones del menu
     */
    $scope.fnclick_dashboard = function() {
      $scope.click_dashboard = true;
      $scope.publicar = false;
      $scope.registrar_usuario = false;
      $scope.categoria_entrada = false;
      $scope.perfil = false;
    };

    $scope.click_categoria_entrada = function() {
      $scope.categoria_entrada = true;
      $scope.click_dashboard = false;
      $scope.publicar = true;
      $scope.registrar_usuario = false;
      $scope.perfil = false;
    };

    $scope.fnclick_publicar = function() {
      $scope.publicar = true;
      $scope.click_dashboard = false;
      $scope.registrar_usuario = false;
      $scope.categoria_entrada = false;
      $scope.perfil = false;
    };

    $scope.fnclick_new_usuario = function() {
      $scope.registrar_usuario = true;
      $scope.click_dashboard = false;
      $scope.publicar = false;
      $scope.categoria_entrada = false;
      $scope.perfil = false;
    };

    $scope.fnclick_perfil = function() {
      $scope.perfil = true;
      $scope.registrar_usuario = false;
      $scope.click_dashboard = false;
      $scope.publicar = false;
      $scope.categoria_entrada = false;
    };

    $scope.inicializar = function() {
      $scope.entradas = [];
      $scope.entradas_ocultas = 0;

      $scope.getCategoriaentradas();
      $scope.getEntradas();

      $scope.fnclick_dashboard();
    };
  }
]);
