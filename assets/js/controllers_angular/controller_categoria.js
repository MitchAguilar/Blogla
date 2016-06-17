var app = angular.module('Blog', []);

app.controller('ControllerCategoria', [
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
  }
]);
